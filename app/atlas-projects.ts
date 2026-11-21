export type ProjectId =
  | "chatcommons"
  | "opensender"
  | "adaptiveNet"
  | "hwine"
  | "solar"
  | "pomodoroAKAtimer"
  | "fstCC"
  | "StockItsMygo"
  | "BoOS";

export type AtlasProject = {
  id: ProjectId;
  name: string;
  category: string;
  title: string;
  body: string;
  stage: [string, string, string];
  facts: [string, string][];
  links: { label: string; href: string }[];
  footnote?: string;
};

export const defaultProjectId: ProjectId = "chatcommons";

// Checked against the public repositories' main-branch READMEs on 2026-11-20.
// These are project descriptions and process diagrams, not live status feeds.
export const projects: AtlasProject[] = [
  {
    id: "chatcommons",
    name: "chatcommons",
    category: "通信协议",
    title: "聊天社区换了服务器，记录怎么办？",
    body: "聊天记录由参与者保存并签名，服务器可以更换。目前有供朋友和贡献者试用的桌面文字客户端，协议、同步流程和本地存储都能查阅。",
    stage: ["本机写入", "交换记录", "验证合并"],
    facts: [
      ["版本", "0.1.0-alpha.7"],
      ["身份签名", "Ed25519"],
      ["本地存储", "SQLite"],
      ["状态", "朋友与贡献者内测"],
    ],
    links: [
      {
        label: "阅读协议",
        href: "https://github.com/TT1nKer/chatcommons/blob/main/docs/protocol.md",
      },
      { label: "查看源码", href: "https://github.com/TT1nKer/chatcommons" },
    ],
    footnote:
      "暂无正式托管服务或正式安装包；尚不支持语音、账号恢复和多设备身份。",
  },
  {
    id: "opensender",
    name: "opensender",
    category: "文件传输",
    title: "把大文件分块传，断了接着传。",
    body: "单条连接跑不满带宽时，同时传多个文件块。每块独立校验，中断后只补缺失部分，适合已有加密隧道的点对点传输。",
    stage: ["拆分文件", "并行传输", "校验续传"],
    facts: [
      ["版本", "v0.1.4"],
      ["传输", "HTTP Range"],
      ["校验", "SHA-256"],
      ["续传", "按块记录"],
    ],
    links: [
      {
        label: "下载工具",
        href: "https://github.com/TT1nKer/opensender/releases/latest",
      },
      { label: "使用方法", href: "https://github.com/TT1nKer/opensender#use" },
    ],
  },
  {
    id: "adaptiveNet",
    name: "adaptiveNet",
    category: "动力系统",
    title: "调一个参数，图案会怎样变？",
    body: "在浏览器里改变温度、连接方式和反应速率，观察图案、记忆与群体状态如何变化。11 个模型可以直接运行，也能用链接分享参数。",
    stage: ["设定参数", "局部更新", "观察变化"],
    facts: [
      ["模型", "11 个交互实验"],
      ["运行", "直接在浏览器中"],
      ["参数", "可用链接分享"],
    ],
    links: [
      {
        label: "打开实验",
        href: "https://tt1nker.github.io/adaptiveNet/index.zh.html",
      },
      { label: "模型与源码", href: "https://github.com/TT1nKer/adaptiveNet" },
    ],
  },
  {
    id: "hwine",
    name: "hwine",
    category: "硬件综合",
    title: "同一个算式，能少用些电路吗？",
    body: "同一组整数乘加可以有不同的电路实现。这里搜索替代写法，检查每种实现算得是否一致，再比较资源和时序；目前的重点是小规模定宽算术与点积。",
    stage: ["替换算式", "验证等价", "测量取舍"],
    facts: [
      ["产物", "SystemVerilog"],
      ["验证", "Yosys"],
      ["布局布线", "nextpnr / ECP5"],
    ],
    links: [
      {
        label: "查看实验进展",
        href: "https://github.com/TT1nKer/hwine/blob/main/docs/PROJECT_STATUS.md",
      },
      { label: "运行与源码", href: "https://github.com/TT1nKer/hwine" },
    ],
  },
  {
    id: "solar",
    name: "solar",
    category: "轨道力学",
    title: "从地球去火星，要改变多少速度？",
    body: "从开普勒方程到地火转移轨道，用可复现的计算练习轨道力学。每项验证都列出参考值、误差和限制，目前是教学实验工具，不能用于实际任务设计。",
    stage: ["设定轨道", "计算转移", "核对结果"],
    facts: [
      ["实现", "C++17"],
      ["示例", "地火霍曼转移"],
      ["用途", "教学与实验"],
    ],
    links: [
      {
        label: "看一次地火转移计算",
        href: "https://github.com/TT1nKer/solar/blob/main/docs/validation/02_hohmann_earth_mars.md",
      },
      { label: "运行方法", href: "https://github.com/TT1nKer/solar#quick-start" },
    ],
  },
  {
    id: "pomodoroAKAtimer",
    name: "pomodoroAKAtimer",
    category: "专注计时",
    title: "安排一段专注，也留出休息。",
    body: "设置专注与休息时长，按自己的顺序组合。计时、统计和环境声都在浏览器里运行；记录默认留在本机，离线也能用，登录同步仍处于测试阶段。",
    stage: ["安排时段", "开始计时", "记录完成"],
    facts: [
      ["使用", "无需安装"],
      ["记录", "本机保存"],
      ["序列", "自定义时长与顺序"],
      ["登录同步", "测试中"],
    ],
    links: [
      { label: "打开番茄钟", href: "https://ttinker.net/pomodoro/" },
      { label: "查看源码", href: "https://github.com/TT1nKer/pomodoroAKAtimer" },
    ],
  },
  {
    id: "fstCC",
    name: "fstCC",
    category: "编译器",
    title: "从汇编写起，编译一个小型 C 子集。",
    body: "用手写汇编实现一个小型 C 编译器，输出 RV64 汇编。语言范围有明确约定，测试对照 GCC 检查结果；当前完成的是起步阶段，还不能编译自身。",
    stage: ["读取源码", "检查语义", "生成汇编"],
    facts: [
      ["输入", "L0 C 子集"],
      ["输出", "RV64IM 汇编"],
      ["实现", "RISC-V 汇编"],
      ["状态", "Stage 0，未自举"],
    ],
    links: [
      {
        label: "支持哪些语法",
        href: "https://github.com/TT1nKer/fstCC/blob/main/doc/l0-language.md",
      },
      {
        label: "运行与验证",
        href: "https://github.com/TT1nKer/fstCC#reproduce-from-a-clean-checkout",
      },
    ],
  },
  {
    id: "StockItsMygo",
    name: "StockItsMygo",
    category: "行情观察",
    title: "把关心的股票和信号放到一起看。",
    body: "导入行情，按技术指标筛选，再把关注的股票收进自己的列表。支持本地演示数据和自行部署，主分支使用美股数据；这是观察与研究工具，不负责自动交易。",
    stage: ["导入行情", "计算指标", "整理列表"],
    facts: [
      ["市场", "美股主分支"],
      ["运行", "自行部署"],
      ["存储", "TimescaleDB"],
      ["演示", "自带离线数据"],
    ],
    links: [
      {
        label: "部署与演示",
        href: "https://github.com/TT1nKer/StockItsMygo#五分钟启动",
      },
      { label: "查看源码", href: "https://github.com/TT1nKer/StockItsMygo" },
    ],
  },
  {
    id: "BoOS",
    name: "BoOS",
    category: "运行环境",
    title: "给 AI 运行时划清身份和权限。",
    body: "在 Linux 上划分独立身份、私有状态和请求队列，让常驻进程开机就能启动。目前已实现这些基础边界，尚未接入规划模型，也没有技能共享和多智能体调度。",
    stage: ["提交请求", "权限检查", "保存结果"],
    facts: [
      ["基础", "Linux / Rust"],
      ["身份", "Linux UID"],
      ["状态", "基础层实验"],
    ],
    links: [
      {
        label: "查看当前实现",
        href: "https://github.com/BoltzmannOS-BoOS/minimalLinuxCore",
      },
      { label: "项目介绍", href: "/boos/" },
    ],
  },
];
