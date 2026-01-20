# Aura Writing Pipeline - Global Configuration

## System Overview
This is an intelligent writing assistance system that transforms raw thoughts, learning notes, and draft content into publication-ready material optimized for different platforms (小红书, X/Twitter, WeChat groups, etc.).

## Core Principles

### 1. No Fabrication
- **Never introduce factual claims** not present in the source material
- Use `[待补充: description]` placeholders for missing information
- When uncertain, explicitly mark as "需要验证" rather than guessing

### 2. Reasoning Transparency
- Every significant modification must have documented reasoning
- Reasoning must reference either:
  - Cognitive learning principles (费曼学习法, 精细化加工, etc.)
  - Platform objective functions (engagement, retention, shareability)
- No "cosmetic" changes without clear purpose

### 3. Evidence & Citation
- When referencing source text, use specific excerpts (≤ 20 characters)
- When applying platform best practices, note the source type
- Distinguish between:
  - Stable platform principles (structure, length, density)
  - Temporal trends (not to be relied upon)

### 4. Output Structure Standards
All agents must produce structured outputs using:
- **Headers**: Clear section markers
- **Bullet points**: For lists and action items
- **Code blocks**: For placeholders or template structures
- **Quotes**: For source text excerpts

### 5. Language & Tone Constraints
Unless platform strategy explicitly requires otherwise:
- **专业清晰** (professional clarity) over 情绪化夸张 (emotional exaggeration)
- Short sentences preferred (< 25 characters for Chinese, < 20 words for English)
- Technical terms must be explained on first use
- No emojis unless platform strategy demands it

### 6. Information Density
- Each paragraph should carry **one core idea**
- Avoid redundant phrasing
- Prefer concrete examples over abstract descriptions
- Balance depth with readability

## Platform Defaults

### 小红书 (Xiaohongshu)
- **Structure**: Hook开头 → 场景/痛点 → 解决方案/干货 → CTA
- **Length**: 500-800 字
- **Tone**: 亲切但专业，有温度的知识分享
- **Formatting**: 分段要短，多用emoji做视觉锚点（适度）

### X (Twitter)
- **Structure**: 开门见山 → 核心洞察 → 可选例证 → 思考问题
- **Length**: 280字符（单条）或 3-5条thread
- **Tone**: 犀利/有态度，信息密度高
- **Formatting**: 段落清晰，关键词可加粗（用**词**）

### 微信群
- **Structure**: 背景简述 → 核心内容 → 引发讨论的问题
- **Length**: 300-600字
- **Tone**: 温和专业，邀请对话
- **Formatting**: 避免过长段落，留白充足

## Workflow Constraints

### Inter-Agent Communication
- Each sub-agent receives **only the inputs specified** in its contract
- Orchestrator is responsible for **conflict resolution**
- No agent should override orchestrator decisions

### Quality Gates
Before final delivery, content must pass:
1. **Clarity check**: 一句话主张是否明确？
2. **Evidence check**: 关键论断是否有支撑？
3. **Platform check**: 是否符合目标平台的结构与长度规范？
4. **Fabrication check**: 是否引入了原文不存在的事实？

### Versioning & Iteration
- All intermediate outputs saved to `/outputs/[timestamp]/`
- Each revision includes change log
- User feedback can be fed back to any stage

## Prohibited Actions
1. ❌ Creating "inspirational" content that lacks substance
2. ❌ Using platform tricks that sacrifice clarity
3. ❌ Answering coach questions on behalf of the user
4. ❌ Mixing personal opinions into factual reporting
5. ❌ Generating clickbait titles that misrepresent content

## Success Metrics
A successful output achieves:
- ✅ **可理解性**: Target audience can follow without re-reading
- ✅ **可信性**: Claims are supported, caveats noted
- ✅ **可传播性**: Structure fits platform conventions
- ✅ **可迭代性**: Change log enables learning

## Emergency Fallbacks
If any sub-agent fails or returns insufficient output:
- Orchestrator should **halt and report**, not attempt to fill in
- User should be notified which stage failed
- Partial outputs should still be saved for inspection

---

**Last Updated**: 2026-01-20
**Version**: 1.0
**Maintainer**: User (via Claude Code orchestration)