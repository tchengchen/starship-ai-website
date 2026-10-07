(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  let lang = 'zh';
  try { lang = localStorage.getItem('starship-language') === 'en' ? 'en' : 'zh'; } catch {}
  const urlLang = new URLSearchParams(location.search).get('lang');
  if (urlLang === 'en' || urlLang === 'zh') lang = urlLang;
  let scenario = 'research';
  let running = false;
  let timer;
  const scenarios = {
    research: {
      zh: { prompt: '帮我建立一家公司的研究框架，并列出需要核验的关键风险。', steps: [['研究 Agent', '梳理业务、行业与研究问题'], ['证据 Agent', '组织资料来源，标记待核验信息'], ['分析 Agent', '归纳关键驱动因素与风险线索']], ready: '演示输出：一份带有来源核验清单的研究框架。点击下方运行，查看协作过程。', done: '研究框架已生成（示例）：业务模式 → 竞争格局 → 财务质量 → 风险清单。下一步：由研究人员核验原始资料。' },
      en: { prompt: 'Build a company research framework and identify the key risks to verify.', steps: [['Research agent', 'Structure the business, industry and research questions'], ['Evidence agent', 'Organize sources and flag information to verify'], ['Analysis agent', 'Summarize key drivers and potential risks']], ready: 'Demo output: a research framework with a source verification checklist. Run the workflow to see the collaboration.', done: 'Example framework: business model → competition → financial quality → risk checklist. Next: a researcher verifies the original sources.' }
    },
    knowledge: {
      zh: { prompt: '把分散的企业文档，整理成一个可追溯的知识问答流程。', steps: [['知识 Agent', '识别文档主题与适用范围'], ['检索 Agent', '定位相关段落，保留来源线索'], ['回答 Agent', '组织答案，并标注信息缺口']], ready: '演示输出：带来源的知识回答流程。点击下方运行，查看知识如何连接。', done: '知识流程已生成（示例）：问题 → 文档检索 → 来源引用 → 回答审核。没有足够依据的内容将标记为待补充。' },
      en: { prompt: 'Turn scattered company documents into a traceable knowledge Q&A workflow.', steps: [['Knowledge agent', 'Identify document topics and scope'], ['Retrieval agent', 'Locate relevant passages and retain source references'], ['Answer agent', 'Structure an answer and flag information gaps']], ready: 'Demo output: a source-linked knowledge workflow. Run it to explore how knowledge connects.', done: 'Example workflow: question → document retrieval → citations → answer review. Content without enough evidence is flagged for follow-up.' }
    },
    workflow: {
      zh: { prompt: '将每周业务资料汇总为报告草稿，发布前交给负责人审核。', steps: [['规划 Agent', '拆解任务并确认所需输入'], ['执行 Agent', '汇总资料，组织报告草稿'], ['审核节点', '检查缺失信息，等待人工确认']], ready: '演示输出：一条包含人工审核节点的周报工作流。点击下方运行，查看任务如何推进。', done: '报告流程已生成（示例）：资料汇总 → 草稿整理 → 缺失项检查 → 人工审批。当前停在审核节点，不执行对外发布。' },
      en: { prompt: 'Prepare a weekly business report draft and send it to an owner for review before publication.', steps: [['Planning agent', 'Break down the task and confirm required inputs'], ['Execution agent', 'Consolidate information and structure a draft'], ['Review checkpoint', 'Check information gaps and await human approval']], ready: 'Demo output: a weekly reporting workflow with human review. Run it to see how the task progresses.', done: 'Example workflow: consolidate → draft → check gaps → human approval. The workflow stops at review; nothing is published externally.' }
    }
  };
  function renderDemo() {
    clearTimeout(timer); running = false;
    const data = scenarios[scenario][lang];
    $('#demo-prompt').textContent = data.prompt;
    $('#workflow').replaceChildren(...data.steps.map(([name, detail], i) => {
      const row = document.createElement('div'); row.className = 'workflow-step';
      const icon = document.createElement('span'); icon.className = 'step-icon'; icon.textContent = `0${i+1}`;
      const copy = document.createElement('div'); copy.className = 'step-copy';
      const title = document.createElement('strong'); title.textContent = name;
      const note = document.createElement('small'); note.textContent = detail;
      const status = document.createElement('span'); status.className = 'step-state'; status.textContent = lang === 'zh' ? '待运行' : 'READY';
      copy.append(title, note); row.append(icon, copy, status); return row;
    }));
    $('#demo-output').textContent = data.ready;
    $('#run-demo').disabled = false;
    $('#run-demo span').textContent = lang === 'zh' ? '运行工作流演示' : 'Run workflow demo';
    $$('.demo-tabs button').forEach(button => { const selected = button.dataset.scenario === scenario; button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; });
    $('#demo-panel').setAttribute('aria-labelledby', `tab-${scenario}`);
  }
  function setLanguage(value) {
    lang = value;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    $$('[data-zh][data-en]').forEach(el => { el.innerHTML = el.dataset[lang]; });
    $$('[data-placeholder-zh]').forEach(el => { el.placeholder = el.dataset[lang === 'zh' ? 'placeholderZh' : 'placeholderEn']; });
    $('#language').innerHTML = lang === 'zh' ? '<b>中</b> <span>/</span> EN' : '中 <span>/</span> <b>EN</b>';
    $('#language').setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
    document.title = lang === 'zh' ? 'Starship AI 星舰科技 | AI 大模型与 Agent 开发' : 'Starship AI | Large Language Models & Intelligent Agents';
    const description = lang === 'zh' ? 'Starship AI 星舰科技，总部位于香港，在新加坡和美国设有分支机构。专注 AI 大模型与智能 Agent 开发，让专业投资能力触手可及。' : 'Starship AI develops large language models and intelligent agents. Headquartered in Hong Kong, with branches in Singapore and the United States.';
    $('meta[name="description"]').content = description;
    $('meta[property="og:description"]').content = description;
    $('meta[property="og:title"]').content = document.title;
    $('#brief-status').textContent = '';
    try { localStorage.setItem('starship-language', lang); } catch {}
    renderDemo();
  }
  $('#language').addEventListener('click', () => setLanguage(lang === 'zh' ? 'en' : 'zh'));
  const closeMenu = () => { $('#navigation').classList.remove('open'); $('#menu-toggle').setAttribute('aria-expanded','false'); };
  $('#menu-toggle').addEventListener('click', () => { const expanded = $('#navigation').classList.toggle('open'); $('#menu-toggle').setAttribute('aria-expanded', String(expanded)); });
  $$('#navigation a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  $$('.demo-tabs button').forEach((button, i, buttons) => {
    button.addEventListener('click', () => { scenario = button.dataset.scenario; renderDemo(); });
    button.addEventListener('keydown', e => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)) return;
      e.preventDefault();
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length-1 : (i + (['ArrowRight','ArrowDown'].includes(e.key) ? 1 : -1) + buttons.length) % buttons.length;
      buttons[n].click(); buttons[n].focus();
    });
  });
  $('#run-demo').addEventListener('click', () => {
    if (running) return;
    renderDemo(); running = true; $('#run-demo').disabled = true;
    $('#run-demo span').textContent = lang === 'zh' ? '正在演示协作流程…' : 'Demonstrating collaboration…';
    $('#demo-output').textContent = lang === 'zh' ? '按顺序执行示例步骤…' : 'Walking through the example steps…';
    let i = 0;
    const step = () => {
      const row = $$('.workflow-step')[i]; row.classList.add('complete'); row.querySelector('.step-icon').textContent = '✓'; row.querySelector('.step-state').textContent = lang === 'zh' ? '完成' : 'DONE'; i++;
      if (i < 3) timer = setTimeout(step, 650);
      else { running = false; $('#demo-output').textContent = scenarios[scenario][lang].done; $('#run-demo').disabled = false; $('#run-demo span').textContent = lang === 'zh' ? '重新演示' : 'Replay demo'; }
    };
    timer = setTimeout(step, 400);
  });
  $('#open-brief').addEventListener('click', () => $('#brief-dialog').showModal());
  $('#privacy-button').addEventListener('click', () => $('#privacy-dialog').showModal());
  $$('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
  $$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) { const r=d.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close(); } }));
  $('#brief-form').addEventListener('submit', e => {
    e.preventDefault();
    const goal = $('#project-goal').value.trim(); if (!goal) { $('#project-goal').value=''; $('#project-goal').reportValidity(); return; }
    const type = $('#project-type').selectedOptions[0].textContent;
    const content = lang === 'zh' ? `Starship AI 星舰科技｜项目需求简报\n\n项目方向：${type}\n项目目标：\n${goal}\n\n待进一步讨论\n1. 目标用户与典型使用场景\n2. 可用数据与访问权限\n3. 现有系统与部署环境\n4. 质量评估与验收标准\n5. 计划时间与预算范围\n6. 人工审核与安全边界\n\n此简报在浏览器中生成，未提交至 Starship AI。\n` : `Starship AI | Project brief\n\nProject focus: ${type}\nProject goal:\n${goal}\n\nTopics to discuss\n1. Target users and core use cases\n2. Available data and access permissions\n3. Existing systems and deployment environment\n4. Evaluation and acceptance criteria\n5. Timeline and budget range\n6. Human review and safety boundaries\n\nGenerated locally in your browser. Not submitted to Starship AI.\n`;
    const url = URL.createObjectURL(new Blob(['\ufeff',content],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a'); a.href=url;a.download=`Starship-AI-project-brief-${lang}.txt`; document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
    $('#brief-status').textContent = lang === 'zh' ? '需求简报已生成并开始下载。此操作未提交或发送任何信息。' : 'Your brief is ready and the download has started. Nothing has been submitted or sent.';
  });
  function clocks(){ $$('[data-clock]').forEach(el=>{el.textContent = new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:el.dataset.clock}).format(new Date());}); }
  clocks(); setInterval(clocks,60000); $('#year').textContent = new Date().getFullYear();
  setLanguage(lang);
  // Procedural orbital sculpture: no external assets, fonts, libraries or network requests.
  const canvas = $('#orb'), ctx = canvas.getContext('2d');
  if (!ctx) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let size=0, phase=0, frame=0, visible=true;
  function resize(){size=canvas.clientWidth;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(size*dpr);canvas.height=Math.round(size*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  function project(x,y,z){const yaw=.4+phase;let xx=x*Math.cos(yaw)+z*Math.sin(yaw);let zz=-x*Math.sin(yaw)+z*Math.cos(yaw);let yy=y*.87-zz*.49;zz=y*.49+zz*.87;return [size/2+(xx*.95+yy*.18)*size*.315,size/2+yy*size*.315,zz];}
  function draw(){
    ctx.clearRect(0,0,size,size);
    const g=ctx.createRadialGradient(size*.5,size*.5,0,size*.5,size*.5,size*.45);g.addColorStop(0,'#bafc8816');g.addColorStop(.65,'#67af4910');g.addColorStop(1,'#080b0a00');ctx.fillStyle=g;ctx.fillRect(0,0,size,size);
    for(let lat=-75;lat<=75;lat+=7.5){const a=lat*Math.PI/180;ctx.beginPath();for(let deg=0;deg<=360;deg+=3){let t=deg*Math.PI/180;let p=project(Math.cos(a)*Math.cos(t),Math.sin(a),Math.cos(a)*Math.sin(t));if(!deg)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);}ctx.strokeStyle='#bafc884b';ctx.lineWidth=.55;ctx.stroke();}
    for(let lon=0;lon<180;lon+=8){ctx.beginPath();for(let deg=0;deg<=360;deg+=3){let a=deg*Math.PI/180,t=lon*Math.PI/180;let p=project(Math.cos(a)*Math.cos(t),Math.sin(a),Math.cos(a)*Math.sin(t));if(!deg)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);}ctx.strokeStyle='#a9e67c35';ctx.lineWidth=.55;ctx.stroke();}
    for(let ring=0;ring<3;ring++){ctx.beginPath();for(let j=0;j<=360;j++){let a=j*Math.PI/180;let x=Math.cos(a)*(1.26+ring*.09),y=Math.sin(a)*.26,z=Math.sin(a)*(1.26+ring*.09);const p=project(x,y,z);if(!j)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);}ctx.strokeStyle=ring===0?'#c6ff9188':'#8ec95b27';ctx.lineWidth=ring===0?.8:.6;ctx.stroke();}
    for(let n=0;n<33;n++){const a=n*2.39996;const z=1-2*(n+.5)/33;const r=Math.sqrt(1-z*z);const p=project(r*Math.cos(a),z,r*Math.sin(a));if(p[2]>0){ctx.beginPath();ctx.arc(p[0],p[1],n%4===0?2.2:1.1,0,Math.PI*2);ctx.fillStyle='#dcffc2';ctx.shadowBlur=10;ctx.shadowColor='#bafc88';ctx.fill();ctx.shadowBlur=0;}}
  }
  function animate(){ if(!motion.matches && visible && !document.hidden){phase+=.0015;draw();}frame=requestAnimationFrame(animate); }
  new ResizeObserver(resize).observe(canvas); new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(canvas);
  motion.addEventListener('change',()=>{draw();});
  resize();animate();
})();
