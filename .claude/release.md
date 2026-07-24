# Release card — Teyvat Palette (yGenshinColor)

<!-- 由 release skill 生成于 2026-07-10(yTemplate 时代),2026-07-23 随 v0.2.0 校正为本仓库事实;发版流程见 user 级 release skill,本卡只记录项目特异性事实。 -->

## 版本文件(bump 时全部同步)

- `package.json`

## 门禁

- `pnpm check && pnpm build`(check = biome check + tsc --noEmit)
- smoke:—(`next build` 全量预渲染即端到端产物验证)

## CHANGELOG

- `CHANGELOG.md`,Keep a Changelog,英文
- 应用内 changelog:`src/lib/changelog.ts`(单语英文;release 带 title/summary,change 带 kind/title/text,text 不以标题开头)

## 发布渠道

- 渠道:B(`gh release create vX.Y.Z --notes-file <(CHANGELOG 对应小节)`)
- `.github/workflows/ci.yml` 只是 push/PR 门禁(lint + typecheck + build),不做 tag 触发发布;发版前确认最新 CI run 是绿的

## 本项目特有注意事项

- **分支策略**:本仓库直接在 `main` 开发,tag 打在 main 上(yTemplate 的 dev→main 流程不适用)。
- 历史沿革:仓库由 yTemplate 0.1.2 复制而来,v0.1.x 的 tag 只存在于 yTemplate 仓库;本仓库首个 tag 为 v0.2.0,CHANGELOG 旧条目链接仍指向 yTemplate。
- 本工程默认本地端口 **4395**(`package.json` 的 dev/start + `.claude/launch.json` 均已固定)。用户常驻 `next dev`(端口 4395):Next 16 拒绝同项目第二个 dev 实例,验证页面直接 curl 4395 的 SSR 产物即可(该端口若被占用,临时换端口起一个实例验证,验证后关掉)。
