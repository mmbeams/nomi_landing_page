import { useEffect, useRef } from 'react'
import { useIsMobile } from '@/hooks/useMobile'

/*
 * Interactive notch demo — a faithful port of the product's notch hub
 * (docs/design/helm-notch-nomi.html) so visitors can try the real
 * interaction on the landing page: hover to expand, 5-module panel,
 * media view, AI-triage capture, calendar, agents, file shelf, focus
 * timer, permission banner, drag & drop. Colors follow landing DESIGN.md.
 */

const CSS = `
.nd{--sans:-apple-system,BlinkMacSystemFont,"SF Pro Text","Inter","Helvetica Neue",sans-serif;
  --mono:ui-monospace,"SF Mono","JetBrains Mono",Menlo,monospace;
  --ink:#2D2A26;--ink2:#6E675F;--ink3:#A29A91;
  --logo:#271C11;
  --hair:#ECEAE7;--pill:#F3F1EE;
  --g1:#00D68F;--g2:#0A84FF;
  --ok:#28a745;--warn:#ff9500;--bad:#e5484d;
  --nd-shadow:0 1px 2px rgba(45,42,38,.05),0 6px 18px rgba(45,42,38,.07);
  --nd-shadow-xl:0 8px 24px rgba(45,42,38,.14),0 32px 80px rgba(45,42,38,.22);
  --ease:cubic-bezier(.32,.72,0,1);
  width:100%;display:flex;flex-direction:column;align-items:center;gap:14px}
.nd,.nd *{box-sizing:border-box}
.nd .frame{position:relative;width:100%;max-width:640px;height:150px;overflow:hidden;
  transition:height .46s var(--ease);
  border-radius:24px;border:1px solid rgba(235,232,229,.5);
  background:rgba(255,255,255,.12);
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  box-shadow:none;
  font-family:var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased}
/* frame grows with the shell: short strip when idle, full desktop when the panel is open */
.nd .frame:has(.shell.open){height:560px}
/* collapsed-state cue under the notch */
.nd .hoverhint{position:absolute;top:46px;left:50%;transform:translateX(-50%);white-space:nowrap;
  font-size:11.5px;color:var(--ink2);background:rgba(255,255,255,.55);
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  border-radius:999px;padding:6px 14px;pointer-events:none;
  opacity:0;transition:opacity .3s .2s linear}
.nd .shell:not(.open)~.hoverhint{opacity:1}

/* menubar + notch */
.nd .menubar{position:relative;height:34px;background:#0a0a0c;display:flex;align-items:center;
  padding:0 16px;color:rgba(255,255,255,.85);font-size:12.5px;gap:16px;user-select:none}
.nd .menubar .r{margin-left:auto;display:flex;gap:12px;color:rgba(255,255,255,.6);font-size:11.5px}
.nd .shell{position:absolute;top:0;left:50%;transform:translateX(-50%);width:310px;z-index:70;
  background:#fff;border-radius:0 0 14px 14px;overflow:hidden;cursor:pointer;color:var(--ink);
  transition:width .46s var(--ease),border-radius .4s var(--ease),box-shadow .4s var(--ease)}
.nd .shell.open{width:min(440px,calc(100% - 24px));border-radius:0 0 26px 26px;box-shadow:var(--nd-shadow-xl);cursor:default}
.nd .toprow{display:flex;align-items:stretch;height:34px}
.nd .tl,.nd .tr{flex:1;display:flex;align-items:center;gap:5px;padding:0 10px;opacity:0;
  pointer-events:none;transition:opacity .25s .16s linear;white-space:nowrap}
.nd .shell:not(.open) .tl,.nd .shell:not(.open) .tr{flex:0 0 0;padding:0;overflow:hidden}
.nd .tr{justify-content:flex-end}
.nd .shell.open .tl,.nd .shell.open .tr{opacity:1;pointer-events:auto}
.nd .tl .lg{display:flex;align-items:center;gap:7px;cursor:pointer;font-size:12.5px;font-weight:700;color:var(--ink)}
.nd .tl .lg svg{color:var(--logo)}
.nd .shell.dark .tl .lg svg{color:var(--ink)}
.nd .tr .wx{display:flex;align-items:center;gap:4px;font-size:10.5px;color:var(--ink3)}
.nd .tr .gear{width:24px;height:24px;flex:none;border-radius:50%;background:transparent;border:none;color:var(--ink3);cursor:pointer;display:flex;align-items:center;justify-content:center}
.nd .tr .gear:hover{color:var(--ink);background:var(--pill)}
.nd .tr .gear svg{width:14px;height:14px}
.nd .hw{width:310px;height:34px;flex:none;background:#000;border-radius:0 0 14px 14px;
  display:flex;align-items:center;padding:0 14px;gap:9px;position:relative;
  transition:width .46s var(--ease)}
/* open shell narrower than 440 (mobile): shrink the camera housing so the side wings keep room */
.nd .shell.open .hw{width:clamp(170px,calc(100% - 130px),310px)}
.nd .hw .fold{display:flex;align-items:center;gap:9px;flex:1;transition:opacity .2s linear}
.nd .shell.open .hw .fold{opacity:0}
.nd .hw .cam{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:8px;height:8px;
  border-radius:50%;background:#17171b;box-shadow:inset 0 0 2px #000,0 0 0 2.5px #0a0a0c}
.nd .hw svg.logo{color:#fff;opacity:.92;flex:none}
.nd .hw .minicover{width:18px;height:18px;border-radius:5px;flex:none;
  background:linear-gradient(135deg,#3a2f18,#1c1c22);display:flex;align-items:center;justify-content:center}
.nd .hw .minicover svg{width:9px;height:9px;color:rgba(255,255,255,.8)}
.nd .hw .wave{display:flex;align-items:flex-end;gap:2px;height:12px;flex:none}
.nd .hw .wave i{width:2.5px;border-radius:2px;background:linear-gradient(180deg,var(--g1),var(--g2));animation:ndwv 1s var(--ease) infinite alternate}
.nd .hw .wave i:nth-child(1){height:5px}
.nd .hw .wave i:nth-child(2){height:10px;animation-delay:.15s}
.nd .hw .wave i:nth-child(3){height:7px;animation-delay:.3s}
.nd .hw .wave i:nth-child(4){height:11px;animation-delay:.45s}
@keyframes ndwv{to{transform:scaleY(.45)}}
.nd .hw .sp{flex:1}
.nd .hw .stat{display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.75)}
.nd .hw .stat .dot{width:6px;height:6px;border-radius:50%;background:var(--ok)}
/* drop mode */
.nd #dropwrap{overflow:hidden;min-height:0;opacity:0;transition:opacity .3s .12s linear;display:none;padding:14px 16px 16px}
.nd .shell.dropmode #dropwrap{display:block}
.nd .shell.dropmode #pwrap,.nd .shell.dropmode #bwrap{display:none}
.nd .shell.open #dropwrap{opacity:1}
.nd .droptarget{border:2px dashed #d8d8de;border-radius:18px;padding:26px 16px;text-align:center;transition:all .18s var(--ease)}
.nd .droptarget .dic{width:40px;height:40px;border-radius:50%;margin:0 auto 10px;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff}
.nd .droptarget .dic svg{width:18px;height:18px}
.nd .droptarget .t1{font-size:13px;font-weight:700;color:var(--ink)}
.nd .droptarget .t2{font-size:10.5px;color:var(--ink3);margin-top:3px}
.nd .droptarget.hot{border-color:var(--g1);background:rgba(0,214,143,.07)}

/* main panel */
.nd .grow{display:grid;grid-template-rows:0fr;transition:grid-template-rows .46s var(--ease)}
.nd .shell.open .grow{grid-template-rows:1fr}
.nd #pwrap{overflow:hidden;min-height:0;opacity:0;transition:opacity .3s .12s linear}
.nd .shell.open #pwrap{opacity:1}
.nd .okdot{width:8px;height:8px;border-radius:50%;background:var(--ok);display:inline-block}
.nd .mtabs{display:flex;justify-content:center;gap:14px;padding:4px 0 14px}
.nd .mtab{width:40px;height:40px;border-radius:50%;border:2px solid transparent;background:var(--pill);
  color:var(--ink2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s var(--ease)}
.nd .mtab svg{width:17px;height:17px}
.nd .mtab:hover{color:var(--ink)}
.nd .mtab.on{color:var(--ink);
  background:linear-gradient(var(--pill),var(--pill)) padding-box,
             linear-gradient(135deg,var(--g1),var(--g2)) border-box}
.nd .pbody{padding:8px 18px 4px}
.nd .pbody.slide-l{animation:ndsl .3s var(--ease)}
.nd .pbody.slide-r{animation:ndsr .3s var(--ease)}
@keyframes ndsl{from{opacity:.2;transform:translateX(26px)}to{opacity:1;transform:none}}
@keyframes ndsr{from{opacity:.2;transform:translateX(-26px)}to{opacity:1;transform:none}}

/* shared bits */
.nd .wcard{background:var(--cardbg,#fff);border-radius:14px;box-shadow:var(--nd-shadow);transition:box-shadow .18s var(--ease)}
.nd .wcard:hover{box-shadow:0 2px 6px rgba(45,42,38,.06),0 12px 28px rgba(45,42,38,.12)}
.nd .gbtn{background:linear-gradient(90deg,var(--g1),var(--g2));color:#fff;border:none;border-radius:999px;
  padding:8px 18px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans)}
.nd .kbtn{background:var(--ink);color:var(--onink,#fff);border:none;border-radius:999px;padding:8px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans)}
.nd .pbtn{font-size:10.5px;background:var(--pill);border:none;border-radius:999px;padding:5px 11px;color:var(--ink2);cursor:pointer;font-family:var(--sans)}
.nd .pbtn:hover{background:#e9e6e2;color:var(--ink)}
.nd .spark{width:12px;height:12px;border-radius:50%;background:conic-gradient(from 210deg,var(--g1),var(--g2),var(--g1));display:inline-block;flex:none}

/* 1 overview bento */
.nd .bento{display:grid;grid-template-columns:1.35fr 1fr;grid-template-rows:auto auto;gap:10px}
.nd .b-media{grid-row:1/3;display:flex;flex-direction:column;justify-content:flex-end;min-height:128px;cursor:pointer;
  border-radius:16px;overflow:hidden;position:relative;background:linear-gradient(135deg,#26202c,#191a20)}
.nd .b-media .art{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.nd .b-media .art svg{width:34px;height:34px;color:rgba(255,255,255,.35)}
.nd .b-media .meta{position:relative;padding:12px 14px;background:linear-gradient(transparent,rgba(10,10,12,.82))}
.nd .b-media .t{color:#fff;font-size:13.5px;font-weight:700}
.nd .b-media .a{color:rgba(255,255,255,.65);font-size:10.5px;margin-top:1px}
.nd .b-media .eq{position:absolute;right:12px;bottom:14px;display:flex;gap:2px;align-items:flex-end;height:12px}
.nd .b-media .eq i{width:2.5px;border-radius:2px;background:linear-gradient(180deg,var(--g1),var(--g2));animation:ndwv 1s var(--ease) infinite alternate}
.nd .b-media .eq i:nth-child(2){animation-delay:.2s}.nd .b-media .eq i:nth-child(3){animation-delay:.35s}
.nd .bcard{padding:11px 13px;cursor:pointer}
.nd .bcard .lb{display:flex;align-items:center;gap:6px;font-size:10px;color:var(--ink3);letter-spacing:.3px}
.nd .bcard .v{font-size:12.5px;font-weight:600;margin-top:5px;line-height:1.35}
.nd .bcard .s{font-size:10.5px;color:var(--ink3);margin-top:2px}
.nd .quickcap{grid-column:1/3;display:flex;gap:8px;background:var(--pill);border-radius:999px;padding:5px 5px 5px 15px;align-items:center}
.nd .quickcap input{flex:1;min-width:0;border:none;outline:none;background:transparent;font-family:var(--sans);font-size:12.5px;color:var(--ink)}
.nd .quickcap input::placeholder{color:var(--ink3)}

/* 2 media */
.nd .cover{width:76px;height:76px;border-radius:16px;flex:none;background:linear-gradient(135deg,#1c1c22,#3a2f18);
  display:flex;align-items:center;justify-content:center;box-shadow:var(--nd-shadow)}
.nd .cover svg{width:24px;height:24px;color:rgba(255,255,255,.85)}
.nd .mprog{height:6px;border-radius:99px;background:var(--pill);margin-top:10px;overflow:hidden;cursor:pointer}
.nd .mprog i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--g1),var(--g2));transition:width .2s linear}
.nd .mtimes{display:flex;justify-content:space-between;font-family:var(--mono);font-size:9.5px;color:var(--ink3);margin-top:4px}
.nd .mctl{display:flex;align-items:center;justify-content:flex-start;gap:12px;margin-top:12px}
.nd .mbtn{width:36px;height:36px;border-radius:50%;border:none;background:var(--pill);color:var(--ink);cursor:pointer;display:flex;align-items:center;justify-content:center}
.nd .mbtn:hover{background:#e9e6e2}
.nd .mbtn.play{width:44px;height:44px;background:var(--ink);color:var(--onink,#fff)}
.nd .mbtn svg{width:15px;height:15px}
.nd .media2{display:flex;gap:18px;align-items:stretch}
.nd .mleft{width:196px;flex:none}
.nd .mlyr{flex:1;height:196px;overflow:hidden;position:relative;
  -webkit-mask-image:linear-gradient(transparent,#000 22%,#000 78%,transparent);
  mask-image:linear-gradient(transparent,#000 22%,#000 78%,transparent)}
.nd .mlyr .roll{display:flex;flex-direction:column;gap:12px;transition:transform .55s var(--ease)}
.nd .lyr{font-size:14.5px;font-weight:600;color:var(--ink3);line-height:1.45;transition:color .4s,font-size .4s}
.nd .lyr.on{color:var(--ink);font-size:16.5px;font-weight:800}

/* 3 capture */
.nd .kindrow{display:flex;gap:5px;margin-bottom:9px}
.nd .kind{font-size:11.5px;color:var(--ink2);background:var(--pill);border:none;border-radius:999px;padding:6px 12px;cursor:pointer;font-family:var(--sans)}
.nd .kind.on{background:var(--ink);color:var(--onink,#fff);font-weight:600}
.nd .capbox{background:var(--pill);border-radius:16px;padding:11px 13px}
.nd .capbox textarea{width:100%;border:none;outline:none;background:transparent;resize:none;
  font-family:var(--sans);font-size:13px;color:var(--ink);min-height:36px;line-height:1.5}
.nd .capbox textarea::placeholder{color:var(--ink3)}
.nd .caprow{display:flex;align-items:center;margin-top:6px}
.nd .caprow .hint{font-size:10.5px;color:var(--ink3)}
.nd .caprow .send{margin-left:auto}
.nd .recent{margin-top:10px}
.nd .rlab{font-size:10px;color:var(--ink3);letter-spacing:.4px;margin:0 2px 6px}
.nd .ritem{display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:12px}
.nd .ritem:hover{background:var(--pill)}
.nd .ritem .ic{width:20px;height:20px;border-radius:6px;flex:none;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8.5px;font-weight:800}
.nd .ritem .tx{flex:1;font-size:11.5px;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nd .ritem .tx b{color:var(--ink);font-weight:600}
.nd .ritem .tm{font-family:var(--mono);font-size:9px;color:var(--ink3)}
.nd .askout{display:none;margin-top:9px;border-radius:14px;padding:11px 13px;font-size:12px;line-height:1.55;color:var(--ink2);background:var(--cardbg,#fff);box-shadow:var(--nd-shadow)}
.nd .askout.show{display:block}
.nd .askout .who2{display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--ink3);margin-bottom:4px}
.nd .tri{margin-top:9px;border-radius:14px;padding:10px 12px;background:var(--cardbg,#fff);box-shadow:var(--nd-shadow)}
.nd .shell.dark .tri{box-shadow:none;border:1px solid var(--hair)}
.nd .tri .h{display:flex;align-items:center;gap:6px;font-size:10px;color:var(--ink3)}
.nd .tri .row{display:flex;align-items:center;gap:6px;margin-top:7px;flex-wrap:wrap}
.nd .tri .tk{font-size:10px;font-weight:700;color:#fff;border-radius:999px;padding:3px 9px;
  background:linear-gradient(90deg,var(--g1),var(--g2))}
.nd .tri .tk.rec{background:var(--ink);color:var(--onink,#fff)}
.nd .tri .tk.idea{background:#0a84ff}
.nd .tri .tx{font-size:11.5px;color:var(--ink);font-weight:600;flex:1;min-width:0;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nd .tri .xc{font-size:9.5px;font-family:var(--mono);color:var(--ink2);background:var(--pill);border-radius:999px;padding:3px 8px}
.nd .tri .fix{display:flex;gap:5px;margin-top:8px}
.nd .jtoday{border-radius:14px;padding:10px 12px;margin-bottom:9px;background:var(--cardbg,#fff);box-shadow:var(--nd-shadow)}
.nd .shell.dark .jtoday{box-shadow:none;border:1px solid var(--hair)}
.nd .jtoday .d{display:flex;align-items:baseline;gap:7px}
.nd .jtoday .d b{font-size:12px;color:var(--ink)}
.nd .jtoday .d span{font-size:9.5px;color:var(--ink3)}
.nd .jtoday .d .streak{margin-left:auto;font-family:var(--mono);color:var(--ink2);background:var(--pill);border-radius:999px;padding:2px 8px}
.nd .jtoday .pv{font-size:11px;color:var(--ink2);margin-top:6px;line-height:1.55;max-height:110px;overflow-y:auto;white-space:pre-line}

/* 4 calendar */
.nd .weekbar{display:flex;gap:5px;margin-bottom:11px}
.nd .wd{flex:1;text-align:center;padding:7px 0 8px;border-radius:12px;cursor:pointer}
.nd .wd:hover{background:var(--pill)}
.nd .wd .w{font-size:9px;color:var(--ink3)}
.nd .wd .d{font-size:12.5px;font-weight:600;margin-top:2px}
.nd .wd.today{background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff}
.nd .wd.today .w{color:rgba(255,255,255,.8)}
.nd .evrow{display:flex;gap:11px;padding:8px 2px;align-items:flex-start}
.nd .evrow+.evrow{border-top:1px solid var(--hair)}
.nd .evrow .when{font-family:var(--mono);font-size:10.5px;color:var(--ink3);width:40px;flex:none;padding-top:2px}
.nd .evrow .bar{width:3px;border-radius:2px;align-self:stretch;flex:none}
.nd .evrow .t{font-size:12.5px;font-weight:600}
.nd .evrow .s{font-size:10.5px;color:var(--ink3);margin-top:1px}
.nd .addev{display:flex;gap:8px;margin-top:10px;background:var(--pill);border-radius:999px;padding:5px 5px 5px 15px;align-items:center}
.nd .addev input{flex:1;min-width:0;border:none;outline:none;background:transparent;font-size:12px;font-family:var(--sans);color:var(--ink)}

/* 5 file shelf */
.nd .dropzone{border:1.6px dashed #d8d8de;border-radius:16px;padding:16px;text-align:center;color:var(--ink3);
  font-size:11.5px;line-height:1.6;transition:all .18s var(--ease)}
.nd .dropzone.hot{border-color:var(--g1);color:var(--g1);background:#f0fbf5}
.nd .dropzone b{color:var(--ink2)}
.nd .shelf{margin-top:10px;display:flex;flex-direction:column;gap:7px}
.nd .file{display:flex;align-items:center;gap:10px;padding:9px 12px}
.nd .file .fic{width:30px;height:30px;border-radius:9px;flex:none;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:800}
.nd .file .fnm{flex:1;min-width:0}
.nd .file .fnm .n{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nd .file .fnm .s{font-size:10px;color:var(--ink3)}
.nd .file .acts{display:flex;gap:5px}

/* 6 agents */
.nd .swiperow{position:relative}
.nd .swipe{height:296px;overflow-y:auto;scroll-snap-type:y mandatory;scrollbar-width:none;margin:0 -2px;padding:0 2px}
.nd .swipe::-webkit-scrollbar{display:none}
.nd .spage{height:100%;scroll-snap-align:start;overflow:hidden}
.nd .sdots{position:absolute;right:3px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:5px}
.nd .sdot{width:5px;height:5px;border-radius:50%;background:var(--hair);transition:all .2s;cursor:pointer}
.nd .sdot.on{background:linear-gradient(180deg,var(--g1),var(--g2));height:14px;border-radius:99px}
.nd .subh{display:flex;align-items:baseline;gap:7px;font-size:10px;color:var(--ink3);letter-spacing:.4px;margin:0 2px 7px}
.nd .subh b{color:var(--ink2);font-weight:600;font-size:11px}
.nd .portrow{display:flex;align-items:center;gap:10px;padding:9px 12px;margin-bottom:7px}
.nd .portrow .pd{width:7px;height:7px;border-radius:50%;flex:none;background:var(--ok)}
.nd .portrow .pnum{font-family:var(--mono);font-size:11.5px;font-weight:700;min-width:44px}
.nd .portrow .pname{flex:1;font-size:11.5px;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nd .prrow{padding:10px 12px;margin-bottom:7px}
.nd .prrow .h{display:flex;align-items:center;gap:8px}
.nd .prrow .src{width:20px;height:20px;border-radius:6px;background:var(--ink);color:var(--onink,#fff);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex:none}
.nd .prrow .t{font-size:12px;font-weight:600;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nd .prrow .chip{font-size:9.5px;border-radius:999px;padding:3px 8px;flex:none}
.nd .chip.ok{background:#e9f8ee;color:#177a36}
.nd .chip.warn{background:#fff4e8;color:#c05e00}
.nd .shell.dark .chip.ok{background:#1e3a26;color:#7fe0a0}
.nd .shell.dark .chip.warn{background:#3a2c1e;color:#ffc58a}
.nd .prrow .sub{font-size:10.5px;color:var(--ink3);margin-top:4px}
.nd .sess{padding:10px 13px;margin-bottom:8px;cursor:pointer}
.nd .sess .hd{display:flex;align-items:center;gap:8px}
.nd .sess .dot{width:8px;height:8px;border-radius:50%;flex:none}
.nd .d-live{background:var(--ok);box-shadow:0 0 0 3px #e9f8ee}
.nd .d-wait{background:var(--warn);box-shadow:0 0 0 3px #fff2e6}
.nd .d-idle{background:var(--ink3);box-shadow:0 0 0 3px var(--pill)}
.nd .sess .nm{font-size:12.5px;font-weight:600}
.nd .sess .r{margin-left:auto;font-family:var(--mono);font-size:9.5px;color:var(--ink3)}
.nd .sess .ln{font-size:11px;color:var(--ink2);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nd .permcard{border-radius:14px;padding:11px 13px;margin-bottom:8px;background:var(--cardbg,#fff);box-shadow:var(--nd-shadow);border-left:3px solid var(--warn)}
.nd .permcard .ph{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--ink2)}
.nd .permcard .ph b{color:var(--ink)}
.nd .diff{margin:8px 0;border-radius:10px;overflow:hidden;font-family:var(--mono);font-size:10px;line-height:1.7}
.nd .diff .dl{padding:2px 10px}
.nd .diff .rm{background:#fdecec;color:#b3261e}
.nd .diff .ad{background:#e9f8ee;color:#177a36}
.nd .permacts{display:flex;gap:6px}
.nd .qbtns{display:flex;gap:5px;margin-top:7px}
.nd .qb{font-size:10.5px;background:var(--pill);border:none;border-radius:999px;padding:5px 11px;color:var(--ink2);cursor:pointer;font-family:var(--sans)}
.nd .qb:hover{background:#e9e6e2;color:var(--ink)}
.nd .qb.pri{background:linear-gradient(90deg,var(--g1),var(--g2));color:#fff;font-weight:600}

/* 7 clipboard */
.nd .clip{display:flex;align-items:center;gap:10px;padding:9px 12px;margin-bottom:7px}
.nd .clip .cic{width:26px;height:26px;border-radius:8px;flex:none;background:var(--pill);display:flex;align-items:center;justify-content:center;color:var(--ink2)}
.nd .clip .cic svg{width:13px;height:13px}
.nd .clip .tx{flex:1;min-width:0;font-size:11.5px;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nd .clip .tx b{color:var(--ink);font-weight:600}

/* 8 focus */
.nd .focus{display:flex;gap:16px;align-items:center;padding:4px 2px}
.nd .ring{width:104px;height:104px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;position:relative}
.nd .ring .inner{width:86px;height:86px;border-radius:50%;background:var(--cardbg,#fff);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:var(--nd-shadow)}
.nd .ring .tt{font-family:var(--mono);font-size:19px;font-weight:700;letter-spacing:.5px}
.nd .ring .ss{font-size:9px;color:var(--ink3);margin-top:1px}
.nd .fright{flex:1}
.nd .fright .lb{font-size:10px;color:var(--ink3);letter-spacing:.4px}
.nd .fright .task{font-size:12.5px;font-weight:600;margin:4px 0 10px}
.nd .facts{display:flex;gap:6px}

/* permission banner mode */
.nd #bwrap{overflow:hidden;min-height:0;opacity:0;transition:opacity .3s .12s linear;display:none;padding:12px 16px 14px}
.nd .shell.bannermode #bwrap{display:block}
.nd .shell.bannermode #pwrap{display:none}
.nd .shell.open #bwrap{opacity:1}
.nd .shell.bannermode.open{width:min(460px,calc(100% - 24px))}

/* dark panel variant */
.nd .shell.dark{--ink:#f2f2f4;--ink2:#c2c2ca;--ink3:#84848e;--pill:#232327;--hair:#2a2a2e;
  --cardbg:#1d1d21;--onink:#111114;background:#0f0f11}
.nd .shell.dark.open .hw{background:transparent}
.nd .shell.dark .dropzone{border-color:#3a3a40}
.nd .shell.dark .dropzone.hot{background:#14241c}
.nd .shell.dark .droptarget{border-color:#3a3a40}
.nd .shell.dark .diff .rm{background:#3a1e1e;color:#ff9e9e}
.nd .shell.dark .diff .ad{background:#1e3a26;color:#7fe0a0}
.nd .shell.dark .askout,.nd .shell.dark .permcard{box-shadow:none;border:1px solid var(--hair)}
.nd .shell.dark .permcard{border-left:3px solid var(--warn)}
.nd .shell.dark .mbtn:hover,.nd .shell.dark .pbtn:hover,.nd .shell.dark .qb:hover{background:#2c2c31}

/* hint row under the frame */
.nd .ndhint{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;
  font-size:11.5px;color:var(--text-dim,#7C746C);font-family:'Inter',var(--sans)}
.nd .ndhint button{font-size:11px;border:1px solid rgba(45,42,38,.25);border-radius:999px;padding:4px 11px;
  background:transparent;color:var(--text-main,#2D2A26);cursor:pointer;font-family:'Inter',var(--sans);transition:background .2s}
.nd .ndhint button:hover{background:rgba(0,0,0,.05)}
`

const KINDS = [['note', 'Note'], ['journal', 'Journal'], ['focus', 'Focus'], ['ask', 'Ask']]
const PH = {
  note: 'Jot anything — links parse automatically…',
  journal: 'How was today? A couple of lines…',
  focus: 'What are you focusing on…',
  ask: 'Ask the Nomi brain anything…',
}
const LYRICS = ['gravity is working against me', 'and gravity wants to bring me down',
  'oh I will fight it, I will fight it', "oh twice as much ain't twice as good",
  'and can\'t sustain like one half could', 'it wants my soul, it wants my whole life',
  'just keep me where the light is', 'oh keep me where the light is']

const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
const PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'
const PREV = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zM20 6l-10 6 10 6z"/></svg>'
const NEXT = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM4 6l10 6-10 6z"/></svg>'
const NOTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>'
const LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07L11 5"/><path d="M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07L13 19"/></svg>'
const TXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h10"/></svg>'

export default function NotchDemo() {
  const rootRef = useRef(null)
  const apiRef = useRef({})
  const isMobile = useIsMobile()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const $ = s => root.querySelector(s)

    let open = true, tab = 'dash', kind = 'note', playing = true, asked = false, recentOpen = false
    let pos = 112, dur = 245
    let triage = null
    let focusLeft = 25 * 60, focusRun = false, focusTotal = 25 * 60
    let lyrIdx = 2
    const FILES = []
    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

    /* menubar clock + dynamic dates */
    const now = new Date()
    const clkEl = $('#nd-clk'), dateEl = $('#nd-date')
    const tickClock = () => {
      const d = new Date()
      if (clkEl) clkEl.textContent = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      if (dateEl) dateEl.textContent = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
    tickClock()
    const journalDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    const journalWd = now.toLocaleDateString('en-US', { weekday: 'short' })
    const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
    const WEEK = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday); d.setDate(monday.getDate() + i)
      return [d.toLocaleDateString('en-US', { weekday: 'short' }), d.getDate(), d.toDateString() === now.toDateString()]
    })

    /* ── render ── */
    function renderBody() {
      const b = $('#pbody')
      if (tab === 'dash') {
        b.innerHTML = `
        <div class="bento">
          <div class="b-media" id="bMedia">
            <div class="art">${NOTE}</div>
            <div class="eq"><i style="height:5px"></i><i style="height:10px"></i><i style="height:7px"></i></div>
            <div class="meta"><div class="t">Gravity</div><div class="a">John Mayer — Continuum</div></div>
          </div>
          <div class="wcard bcard" id="bCal"><div class="lb"><span class="spark"></span>CALENDAR · NEXT</div>
            <div class="v">10:00 Standup</div><div class="s">in 42 min · then 15:00 1:1</div></div>
          <div class="wcard bcard" id="bAgent"><div class="lb"><span class="okdot"></span>AGENTS</div>
            <div class="v">claude · ~/nomi</div><div class="s">✓ 214 tests — snapshots running · tok 14.2k</div></div>
          <div class="quickcap">
            <input id="qc" placeholder="Quick capture — ⏎ to send, links auto-parse…">
            <button class="gbtn" id="qcBtn">Send</button>
          </div>
        </div>`
        $('#bMedia').onclick = () => switchTab('media')
        $('#bCal').onclick = () => switchTab('cal')
        $('#bAgent').onclick = () => switchTab('agents')
        $('#qcBtn').onclick = qcSend
        $('#qc').addEventListener('keydown', e => { if (e.key === 'Enter') qcSend() })
      }
      else if (tab === 'media') {
        b.innerHTML = `
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:9px">
            <button class="pbtn" id="backDash">‹ Overview</button>
            <span style="font-size:10px;color:var(--ink3)">MEDIA</span></div>
          <div class="media2">
            <div class="mleft">
              <div class="cover" style="width:88px;height:88px">${NOTE}</div>
              <div style="font-size:14.5px;font-weight:700;margin-top:10px">Gravity</div>
              <div style="font-size:11px;color:var(--ink3);margin-top:2px">John Mayer — Continuum</div>
              <div class="mprog" id="prog"><i id="pg" style="width:${pos / dur * 100}%"></i></div>
              <div class="mtimes"><span id="tA">${fmt(pos)}</span><span>${fmt(dur)}</span></div>
              <div class="mctl">
                <button class="mbtn">${PREV}</button>
                <button class="mbtn play" id="pp">${playing ? PAUSE : PLAY}</button>
                <button class="mbtn">${NEXT}</button>
              </div>
            </div>
            <div class="mlyr"><div class="roll" id="roll">${LYRICS.map((l, i) => `<div class="lyr${i === lyrIdx ? ' on' : ''}">${l}</div>`).join('')}</div></div>
          </div>`
        $('#pp').onclick = () => { playing = !playing; renderBody() }
        $('#backDash').onclick = () => switchTab('dash')
        $('#prog').onclick = e => { const r = e.currentTarget.getBoundingClientRect(); pos = Math.round((e.clientX - r.left) / r.width * dur); renderBody() }
        scrollLyr()
      }
      else if (tab === 'capture') {
        b.innerHTML = `
          <div class="kindrow">${KINDS.map(([k, n]) => `<button class="kind${k === kind ? ' on' : ''}" data-k="${k}">${n}</button>`).join('')}</div>
          ${kind === 'journal' ? `<div class="jtoday">
            <div class="d"><b>${journalDate} · ${journalWd}</b><span>today's entry</span><span class="streak">3-day streak</span></div>
            <div class="pv">Wrapped the notch mock this morning — the permission banner's Allow flow finally works.

Afternoon: fixed the media page sizing and first-click deep links, locked in the file-drop state.

Tonight: wiring AI triage into quick notes — walked the design once more.</div>
          </div>` : ''}
          ${kind === 'focus' ? focusHTML() : `<div class="capbox">
            <textarea id="cap" placeholder="${kind === 'journal' ? 'Continue today — Enter appends to this entry…' : PH[kind]}"></textarea>
            <div class="caprow"><span class="hint">${kind === 'ask' ? '⏎ ask · uses your global provider' : kind === 'journal' ? 'One entry per day · append anytime' : '⏎ send · AI triage: record / idea / task (extracts time & place)'}</span>
              <button class="gbtn send" id="capSend">${kind === 'ask' ? 'Ask' : kind === 'journal' ? 'Append' : 'Send'}</button></div>
          </div>`}
          ${triage ? `<div class="tri">
            <div class="h"><span class="spark"></span>AI TRIAGE · STRUCTURED &amp; SAVED</div>
            <div class="row"><span class="tk ${triage.cls}">${triage.kind}</span><span class="tx">${triage.text}</span>
              ${triage.chips.map(c => `<span class="xc">${c}</span>`).join('')}</div>
            <div class="fix"><button class="pbtn" id="triOk">Correct ✓</button>
              <button class="pbtn">Make it a record</button><button class="pbtn">Make it an idea</button></div>
          </div>` : ''}
          <div class="askout${asked ? ' show' : ''}">
            <div class="who2"><span class="spark"></span>Nomi brain</div>
            Links in your notes parse automatically: YouTube via oEmbed, papers via arXiv, pages via OpenGraph — then AI adds a summary and tags.
          </div>
          <div class="recent">
            <button class="rlab" id="rToggle" style="display:flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;padding:2px;color:var(--ink3);font-size:10px;letter-spacing:.4px">
              <span style="display:inline-block;transition:transform .2s;transform:rotate(${recentOpen ? 90 : 0}deg)">▸</span>RECENT · 3</button>
            ${recentOpen ? `
            <div class="ritem"><span class="ic" style="background:#ff2d2d">YT</span>
              <span class="tx"><b>PSY - GANGNAM STYLE M/V</b> · parsed: cover + summary + tags</span><span class="tm">10:08</span></div>
            <div class="ritem"><span class="ic" style="background:#8b5a2b">AX</span>
              <span class="tx"><b>Attention Is All You Need</b> · arXiv abstract fetched</span><span class="tm">11:58</span></div>
            <div class="ritem"><span class="ic" style="background:#2D2A26">N</span>
              <span class="tx">Three e2e pitfalls in the cockpit — logged for the retro.</span><span class="tm">14:31</span></div>` : ''}
          </div>`
        b.querySelectorAll('.kind').forEach(k => k.onclick = () => { kind = k.dataset.k; asked = false; renderBody() })
        $('#rToggle').onclick = () => { recentOpen = !recentOpen; renderBody() }
        const triOk = $('#triOk'); if (triOk) triOk.onclick = () => { triage = null; renderBody() }
        if (kind === 'focus') { bindFocus() }
        else $('#capSend').onclick = () => {
          const c = $('#cap'); if (!c.value.trim()) return
          if (kind === 'ask') { asked = true; renderBody() }
          else if (kind === 'note') {
            // demo triage: time words → task; question mark → idea; else record
            const t = c.value.trim()
            triage = /tonight|tomorrow|\dpm|\dam|:\d|mon|tue|wed|thu|fri|sat|sun/i.test(t)
              ? { kind: 'Task', cls: '', text: t, chips: ['tomorrow 8:00 PM', '→ agent task created'] }
              : /[??]$/.test(t) ? { kind: 'Idea', cls: 'idea', text: t, chips: [] }
                : { kind: 'Record', cls: 'rec', text: t, chips: [] }
            c.value = ''; renderBody()
          }
          else { c.value = ''; c.placeholder = 'Sent — AI is parsing…'; setTimeout(() => { c.placeholder = PH[kind] }, 1500) }
        }
      }
      else if (tab === 'cal') {
        b.innerHTML = `
          <div class="weekbar">${WEEK.map(([w, d, t]) => `<div class="wd${t ? ' today' : ''}"><div class="w">${w}</div><div class="d">${d}</div></div>`).join('')}</div>
          <div class="evrow"><span class="when">10:00</span><span class="bar" style="background:linear-gradient(180deg,var(--g1),var(--g2))"></span>
            <div><div class="t">Standup</div><div class="s">30 min · starts in 42 min</div></div></div>
          <div class="evrow"><span class="when">15:00</span><span class="bar" style="background:linear-gradient(180deg,var(--g1),var(--g2))"></span>
            <div><div class="t">1:1 · design review</div><div class="s">45 min</div></div></div>
          <div class="evrow"><span class="when">18:00</span><span class="bar" style="background:var(--ok)"></span>
            <div><div class="t">Nightly · swift test</div><div class="s">scheduled agent task</div></div></div>
          <div class="addev"><input id="evIn" placeholder="Add event: tomorrow 3pm design review with Sam… (AI parses the time)"><button class="kbtn" id="evBtn">Add</button></div>`
        $('#evBtn').onclick = addEv
        $('#evIn').addEventListener('keydown', e => { if (e.key === 'Enter') addEv() })
      }
      else if (tab === 'files') {
        b.innerHTML = `
          <div class="dropzone" id="dz"><b>Drag files here (or onto the notch)</b><br>They wait on the Shelf → attach to a record / link to a cockpit</div>
          <div class="shelf" id="shelf">${FILES.map((f, i) => fileHTML(f, i)).join('') || ''}</div>
          <div class="rlab" style="margin-top:12px">CLIPBOARD</div>
          <div class="wcard clip"><span class="cic">${LINK}</span>
            <span class="tx"><b>https://arxiv.org/abs/1706.03762</b> · 2 min ago</span>
            <button class="pbtn">Copy</button><button class="pbtn">Note</button></div>
          <div class="wcard clip"><span class="cic">${TXT}</span>
            <span class="tx">asyncio.create_task decouples from the response lifecycle…</span>
            <button class="pbtn">Copy</button><button class="pbtn">Note</button></div>`
        b.querySelectorAll('.clip .pbtn').forEach(x => x.onclick = e => { const t = e.target.textContent; e.target.textContent = '✓'; setTimeout(() => e.target.textContent = t, 900) })
        const dz = $('#dz')
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('hot') })
        dz.addEventListener('dragleave', () => dz.classList.remove('hot'))
        dz.addEventListener('drop', e => {
          e.preventDefault(); dz.classList.remove('hot')
          addFile('Dropped file.pdf', 'PDF · 1.8 MB', '#e5484d', 'PD')
        })
        bindFileActs()
      }
      else if (tab === 'agents') {
        b.innerHTML = `
          <div class="permcard">
            <div class="ph"><span class="spark"></span><b>claude · ~/nomi</b>&nbsp;wants to edit&nbsp;<b>enrich.py</b></div>
            <div class="diff">
              <div class="dl rm">- meta.pop("abstract")</div>
              <div class="dl ad">+ meta["summary"] = meta["abstract"][:300]</div>
            </div>
            <div class="permacts"><button class="kbtn pc-x">Allow</button>
              <button class="pbtn pc-x">Deny</button></div>
          </div>
          <div class="swiperow"><div class="swipe" id="agSwipe">
            <div class="spage">
              <div class="subh"><b>SESSIONS</b>local Claude Code · scroll for ports / PRs</div>
              <div class="wcard sess"><div class="hd"><span class="dot d-live"></span><span class="nm">claude · ~/nomi</span><span class="r">tok 14.2k</span></div>
                <div class="ln">✓ 214 tests passed — running snapshot suite…</div></div>
              <div class="wcard sess"><div class="hd"><span class="dot d-wait"></span><span class="nm">claude · ~/nomi/notch</span><span class="r">needs you</span></div>
                <div class="ln">Question: should the media waveform follow the album color?</div>
                <div class="qbtns"><button class="qb pri">A · Follow album</button><button class="qb">B · Fixed gradient</button><button class="qb">Open session</button></div></div>
              <div class="wcard sess"><div class="hd"><span class="dot d-idle"></span><span class="nm">Nightly · swift test</span><span class="r">next 18:00</span></div>
                <div class="ln">Last run 47/47 passed · avg 3m 12s</div></div>
            </div>
            <div class="spage">
              <div class="subh"><b>LOCAL PORTS</b>LISTENING · lsof</div>
              <div class="wcard portrow"><span class="pd"></span><span class="pnum">:5174</span><span class="pname">Vite · nomi frontend</span><button class="pbtn">Open</button></div>
              <div class="wcard portrow"><span class="pd"></span><span class="pnum">:8769</span><span class="pname">nomi backend · FastAPI</span><button class="pbtn">Open</button></div>
              <div class="wcard portrow"><span class="pd" style="background:var(--warn)"></span><span class="pnum">:3000</span><span class="pname">next dev · portfolio</span><button class="pbtn">Open</button></div>
            </div>
            <div class="spage">
              <div class="subh"><b>PR · COMMIT WATCH</b>your local dev hub</div>
              <div class="wcard prrow"><div class="h"><span class="src">GH</span><span class="t">#52 design: workspace shell + Today</span><span class="chip ok">checks ✓</span></div>
                <div class="sub">Mergeable · 2 approvals · main ← feat/shell</div></div>
              <div class="wcard prrow"><div class="h"><span class="src">GH</span><span class="t">#54 loop docs re-review</span><span class="chip warn">CI running</span></div>
                <div class="sub">macOS job · ~2 min left</div></div>
              <div class="wcard prrow"><div class="h"><span class="src">GT</span><span class="t">feat/cockpit-fanbox</span><span class="chip warn">3 unpushed</span></div>
                <div class="sub">Latest: notch banner + dark panel · 2 min ago</div></div>
            </div>
          </div>
          <div class="sdots" id="agDots"><span class="sdot on"></span><span class="sdot"></span><span class="sdot"></span></div></div>`
        b.querySelectorAll('.pc-x').forEach(x => x.onclick = e => e.target.closest('.permcard').remove())
        b.querySelectorAll('.qb').forEach(q => q.onclick = e => { e.target.textContent = 'Picked ✓' })
        const sw = $('#agSwipe'), dots = [...$('#agDots').children]
        sw.addEventListener('scroll', () => {
          const i = Math.round(sw.scrollTop / sw.clientHeight)
          dots.forEach((d, j) => d.classList.toggle('on', j === i))
        }, { passive: true })
        dots.forEach((d, i) => d.onclick = () => sw.scrollTo({ top: i * sw.clientHeight, behavior: 'smooth' }))
        let dn = false, sy = 0, st = 0
        sw.addEventListener('pointerdown', e => { dn = true; sy = e.clientY; st = sw.scrollTop })
        sw.addEventListener('pointermove', e => { if (dn) sw.scrollTop = st - (e.clientY - sy) })
        ;['pointerup', 'pointerleave'].forEach(ev => sw.addEventListener(ev, () => dn = false))
      }
    }

    function focusHTML() {
      const pct = (1 - focusLeft / focusTotal) * 360
      return `<div class="focus">
          <div class="ring" style="background:conic-gradient(var(--g1) 0deg,var(--g2) ${pct}deg,var(--pill) ${pct}deg)">
            <div class="inner"><span class="tt">${fmt(focusLeft)}</span><span class="ss">${focusRun ? 'focusing' : 'paused'}</span></div>
          </div>
          <div class="fright">
            <div class="lb">LINKED TASK</div>
            <div class="task">Ship the Nomi landing page</div>
            <div class="facts">
              <button class="${focusRun ? 'pbtn' : 'kbtn'}" id="fGo">${focusRun ? 'Pause' : 'Start'}</button>
              <button class="pbtn" id="fRe">Reset</button>
              <button class="pbtn">Switch task</button>
            </div>
          </div>
        </div>`
    }
    function bindFocus() {
      $('#fGo').onclick = () => { focusRun = !focusRun; renderBody() }
      $('#fRe').onclick = () => { focusRun = false; focusLeft = focusTotal; renderBody() }
    }

    function fileHTML(f, i) {
      return `<div class="wcard file" data-i="${i}">
        <span class="fic" style="background:${f.c}">${f.k}</span>
        <span class="fnm"><div class="n">${f.n}</div><div class="s">${f.s}</div></span>
        <span class="acts"><button class="pbtn a-up">Attach</button><button class="pbtn a-ck">Cockpit</button><button class="pbtn a-rm">✕</button></span>
      </div>`
    }
    function bindFileActs() {
      root.querySelectorAll('.file .a-rm').forEach(x => x.onclick = e => { FILES.splice(+e.target.closest('.file').dataset.i, 1); renderBody() })
      root.querySelectorAll('.file .a-up,.file .a-ck').forEach(x => x.onclick = e => { e.target.textContent = '✓ done'; setTimeout(() => { FILES.splice(+e.target.closest('.file').dataset.i, 1); renderBody() }, 700) })
    }
    function addFile(n, s, c, k) { FILES.unshift({ n, s, c, k }); if (tab === 'files') renderBody() }
    function addEv() { const i = $('#evIn'); if (!i.value.trim()) return; i.value = ''; i.placeholder = 'Added (demo) — AI parsed the time'; setTimeout(() => i.placeholder = 'Add event: tomorrow 3pm design review with Sam… (AI parses the time)', 1500) }
    function qcSend() { const i = $('#qc'); if (!i.value.trim()) return; i.value = ''; i.placeholder = 'Sent — AI is parsing…'; setTimeout(() => i.placeholder = 'Quick capture — ⏎ to send, links auto-parse…', 1500) }

    /* tab / panel control */
    const TABS = ['dash', 'capture', 'cal', 'agents', 'files']
    function switchTab(t, dir) {
      tab = t; renderTabs(); renderBody()
      const b = $('#pbody')
      if (dir) { b.classList.remove('slide-l', 'slide-r'); void b.offsetWidth; b.classList.add(dir > 0 ? 'slide-l' : 'slide-r') }
    }
    let wxAcc = 0, wxLock = 0
    const onWheel = e => {
      if (!open) return
      if (e.target.closest('.swipe')) return
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      const t = performance.now(); if (t < wxLock) return
      wxAcc += e.deltaX
      if (Math.abs(wxAcc) > 90) {
        const i = TABS.indexOf(tab), d = wxAcc > 0 ? 1 : -1, ni = Math.min(TABS.length - 1, Math.max(0, i + d))
        if (ni !== i) switchTab(TABS[ni], d)
        wxAcc = 0; wxLock = t + 450
      }
    }
    root.addEventListener('wheel', onWheel, { passive: true })
    function renderTabs() {
      root.querySelectorAll('.mtab').forEach(x => {
        x.classList.toggle('on', x.dataset.t === tab)
        x.onclick = () => switchTab(x.dataset.t)
      })
    }
    const shell = $('#nd-shell')
    function openPanel(t) { shell.classList.remove('bannermode'); open = true; shell.classList.add('open'); if (t) switchTab(t) }
    function closePanel() { open = false; shell.classList.remove('open') }
    $('#nd-notch').onclick = () => { open ? closePanel() : openPanel() }
    /* hover expand (same behavior as the real notch): enter → open, leave → collapse after 220ms */
    let hoverT
    shell.addEventListener('mouseenter', () => { clearTimeout(hoverT); if (!open) openPanel() })
    shell.addEventListener('mouseleave', () => {
      clearTimeout(hoverT)
      hoverT = setTimeout(() => { if (!shell.classList.contains('bannermode')) closePanel() }, 220)
    })
    const onKey = e => { if (e.key === 'Escape') { closePanel(); hideBanner() } }
    document.addEventListener('keydown', onKey)

    /* permission banner */
    function showBanner() { shell.classList.add('bannermode', 'open'); open = true }
    function hideBanner() { shell.classList.remove('bannermode'); closePanel() }

    /* drag a file over the notch → the shell grows a drop surface */
    let wasOpenBeforeDrag = false, dragDepth = 0
    function enterDropMode() {
      if (shell.classList.contains('dropmode')) return
      wasOpenBeforeDrag = open
      shell.classList.add('dropmode', 'open'); open = true
      $('#droptarget').classList.add('hot')
    }
    function exitDropMode(drop) {
      shell.classList.remove('dropmode')
      $('#droptarget').classList.remove('hot')
      if (drop) { openPanel('files') }
      else if (!wasOpenBeforeDrag) { closePanel() }
    }
    shell.addEventListener('dragenter', e => { e.preventDefault(); dragDepth++; enterDropMode() })
    shell.addEventListener('dragover', e => e.preventDefault())
    shell.addEventListener('dragleave', () => { if (--dragDepth <= 0) { dragDepth = 0; exitDropMode(false) } })
    shell.addEventListener('drop', e => {
      e.preventDefault(); dragDepth = 0
      exitDropMode(true); addFile('Dropped file.png', 'PNG · 640 KB', '#0a84ff', 'IM')
    })

    /* timers */
    const iv1 = setInterval(() => {
      if (playing) {
        pos = Math.min(dur, pos + 1)
        const pg = $('#pg'), tA = $('#tA')
        if (pg) { pg.style.width = (pos / dur * 100) + '%'; tA.textContent = fmt(pos) }
      }
      if (focusRun && focusLeft > 0) {
        focusLeft--
        if (tab === 'capture' && kind === 'focus') renderBody()
      }
    }, 1000)
    function scrollLyr() {
      const roll = $('#roll'); if (!roll) return
      const box = roll.parentElement, cur = roll.children[lyrIdx]
      roll.querySelectorAll('.lyr').forEach((el, i) => el.classList.toggle('on', i === lyrIdx))
      if (cur) roll.style.transform = `translateY(${box.clientHeight / 2 - cur.offsetTop - cur.offsetHeight / 2}px)`
    }
    const iv2 = setInterval(() => {
      if (playing && tab === 'media') { lyrIdx = (lyrIdx + 1) % LYRICS.length; scrollLyr() }
    }, 3200)
    const iv3 = setInterval(tickClock, 30000)

    /* hint-row demo actions */
    apiRef.current = {
      showBanner,
      hideBanner,
      openPanel,
      toggleDark: () => shell.classList.toggle('dark'),
      simDrop: () => {
        closePanel()
        setTimeout(() => {
          enterDropMode()
          setTimeout(() => { exitDropMode(true); addFile('design-v3.fig', 'Figma · 4.2 MB', '#a855f7', 'FG') }, 1400)
        }, 350)
      },
    }

    renderTabs(); renderBody(); openPanel('dash')

    return () => {
      clearInterval(iv1); clearInterval(iv2); clearInterval(iv3)
      clearTimeout(hoverT)
      document.removeEventListener('keydown', onKey)
      root.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div className="nd" ref={rootRef}>
      <style>{CSS}</style>
      <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <symbol id="nomi-logo" viewBox="0 0 18 8" fill="none">
          <path d="M1.72754 3.23926H3.59563C5.68043 3.23926 7.3705 4.92933 7.3705 7.01413V7.37071H1.72754V3.23926Z" fill="currentColor" />
          <path d="M10.7466 3.23926H12.6147C14.6995 3.23926 16.3895 4.92933 16.3895 7.01413V7.37071H10.7466V3.23926Z" fill="currentColor" />
          <path d="M0.921875 2.01191C2.03031 1.18897 4.87195 0.0368698 7.37097 2.01191" stroke="currentColor" strokeWidth="1.8432" strokeLinecap="round" />
          <path d="M10.3433 2.01191C11.4517 1.18897 14.2933 0.0368698 16.7924 2.01191" stroke="currentColor" strokeWidth="1.8432" strokeLinecap="round" />
        </symbol>
      </svg>

      <div className="frame">
        <div className="menubar">
          <span style={{ fontWeight: 700 }}>◆</span><span>Finder</span><span>File</span><span>Edit</span><span>View</span>
          <span className="r"><span>100%</span><span id="nd-date">Jul 16</span><span id="nd-clk">14:20</span></span>
        </div>

        <div className="shell" id="nd-shell">
          <div className="toprow">
            <div className="tl">
              <span className="lg" title="Open Nomi">
                <svg width="19" height="9"><use href="#nomi-logo" /></svg>Nomi
              </span>
            </div>
            <div className="hw" id="nd-notch" title="Hover to expand Nomi">
              <div className="fold">
                <svg className="logo" width="19" height="9"><use href="#nomi-logo" /></svg>
                <span className="minicover"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></svg></span>
                <span className="wave"><i></i><i></i><i></i><i></i></span>
                <span className="sp"></span>
                <span className="stat"><span className="dot"></span><span>1 live</span></span>
              </div>
              <span className="cam"></span>
            </div>
            <div className="tr">
              <span className="wx">26°</span>
              <button className="gear" title="Settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34h0a1.7 1.7 0 001-1.55V3a2 2 0 114 0v.09a1.7 1.7 0 001 1.55h0a1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87v0a1.7 1.7 0 001.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.55 1z" /></svg></button>
            </div>
          </div>
          <div className="grow">
            <div style={{ overflow: 'hidden', minHeight: 0 }}>
              <div id="pwrap">
                <div className="pbody" id="pbody"></div>
                <div className="mtabs">
                  <button className="mtab on" data-t="dash" title="Overview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg></button>
                  <button className="mtab" data-t="capture" title="Capture"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 3l4 4L8 20l-5 1 1-5z" /></svg></button>
                  <button className="mtab" data-t="cal" title="Calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg></button>
                  <button className="mtab" data-t="agents" title="Agents"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M7 9l3 3-3 3M13 15h4" /></svg></button>
                  <button className="mtab" data-t="files" title="Shelf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8l3-4h12l3 4v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M3 8h18M12 12v5M9.5 14.5L12 17l2.5-2.5" /></svg></button>
                </div>
              </div>
              <div id="dropwrap">
                <div className="droptarget" id="droptarget">
                  <div className="dic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 10l5 5 5-5" /><path d="M4 19h16" /></svg></div>
                  <div className="t1">Release — stash on the Shelf</div>
                  <div className="t2">Attach to a record / link to a cockpit — it waits on the Shelf</div>
                </div>
              </div>
              <div id="bwrap">
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11.5px', color: 'var(--ink2)' }}>
                  <span className="spark"></span><b style={{ color: 'var(--ink)' }}>claude · ~/nomi</b>&nbsp;wants to edit&nbsp;<b style={{ color: 'var(--ink)' }}>enrich.py</b>
                </div>
                <div className="diff">
                  <div className="dl rm">- meta.pop("abstract")</div>
                  <div className="dl ad">+ meta["summary"] = meta["abstract"][:300]</div>
                </div>
                <div className="permacts">
                  <button className="kbtn" onClick={() => apiRef.current.hideBanner?.()}>Allow</button>
                  <button className="pbtn" onClick={() => apiRef.current.hideBanner?.()}>Deny</button>
                  <button className="pbtn" onClick={() => { apiRef.current.hideBanner?.(); apiRef.current.openPanel?.('agents') }}>Open session</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hoverhint">{isMobile ? 'Tap the notch to open Nomi ↑' : 'Hover the notch to open Nomi ↑'}</div>
      </div>

      <div className="ndhint">
        <span>{isMobile ? 'Tap the notch — it grows into the hub. Everything works.' : 'Hover the notch — it grows into the hub. Everything works.'}</span>
        <button onClick={() => apiRef.current.showBanner?.()}>Agent asks permission</button>
        <button onClick={() => apiRef.current.simDrop?.()}>Drop a file</button>
        <button onClick={() => apiRef.current.toggleDark?.()}>Light / dark</button>
      </div>
    </div>
  )
}
