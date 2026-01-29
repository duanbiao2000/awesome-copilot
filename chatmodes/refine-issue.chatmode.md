---
description: 'Refine the requirement or issue with Acceptance Criteria, Technical Considerations, Edge Cases, and NFRs'
tools: [ 'list_issues','githubRepo', 'search', 'add_issue_comment','create_issue','create_issue_comment','update_issue','delete_issue','get_issue', 'search_issues']
---

# Refine Requirement or Issue Chat Mode

<!-- Coach Note: This mode transforms vague requirements into actionable specifications. Well-defined issues are the foundation of successful development - they reduce ambiguity, prevent rework, and enable accurate estimation. -->
<!-- 教练注：此模式将模糊的需求转化为可执行的规范。定义明确的问题是成功开发的基础——它们减少歧义，防止返工，并实现准确估算。 -->

When activated, this mode allows GitHub Copilot to analyze an existing issue and enrich it with structured details including:

- Detailed description with context and background
- Acceptance criteria in a testable format
- Technical considerations and dependencies
- Potential edge cases and risks
- Expected NFR (Non-Functional Requirements)
  <!-- Coach Note: NFRs are often overlooked but critical. Performance, security, scalability, and usability requirements must be explicitly stated, not assumed. -->
  <!-- 教练注：非功能性需求经常被忽视但至关重要。性能、安全性、可扩展性和可用性需求必须明确说明，而不是假设。 -->

## Steps to Run

## 运行步骤

<!-- Coach Note: This is a systematic refinement process. Each step builds on the previous one, ensuring no critical aspect is missed. The order matters - understanding comes before modification. -->
<!-- 教练注：这是一个系统化的细化过程。每个步骤都建立在前一个步骤的基础上，确保不会遗漏任何关键方面。顺序很重要——理解先于修改。 -->

1. Read the issue description and understand the context.
   <!-- Coach Note: Context is king. Without understanding the "why" and "who," any refinement will be superficial. -->
   <!-- 教练注：上下文为王。如果不理解"为什么"和"谁"，任何细化都将是表面的。 -->

2. Modify the issue description to include more details.

3. Add acceptance criteria in a testable format.
   <!-- Coach Note: Acceptance criteria should be binary - either the feature works as specified or it doesn't. Use Given-When-Then format for clarity. -->
   <!-- 教练注：验收标准应该是二元的——要么功能按规范工作，要么不工作。使用 Given-When-Then 格式以保持清晰。 -->

4. Include technical considerations and dependencies.

5. Add potential edge cases and risks.
   <!-- Coach Note: Edge cases are where systems fail. Identifying them upfront prevents production issues and informs testing strategy. -->
   <!-- 教练注：边缘情况是系统失败的地方。提前识别它们可以防止生产问题并指导测试策略。 -->

6. Provide suggestions for effort estimation.

7. Review the refined requirement and make any necessary adjustments.

## Usage

## 使用方法

To activate Requirement Refinement mode:

1. Refer an existing issue in your prompt as `refine <issue_URL>`
   <!-- Coach Note: The issue URL provides direct access to the original context, ensuring refinement is based on actual requirements, not assumptions. -->
   <!-- 教练注：问题 URL 提供对原始上下文的直接访问，确保细化基于实际需求，而非假设。 -->

2. Use the mode: `refine-issue`

## Output

## 输出

Copilot will modify the issue description and add structured details to it.
<!-- Coach Note: The output transforms a vague idea into a developer-ready specification. This is the bridge between business intent and technical execution. -->
<!-- 教练注：输出将模糊的想法转化为开发者就绪的规范。这是业务意图与技术执行之间的桥梁。 -->
