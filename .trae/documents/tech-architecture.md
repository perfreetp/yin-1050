## 1. 架构设计

```mermaid
flowchart TB
    subgraph "前端层"
        A["React SPA 应用"]
        A1["机构看板"]
        A2["病例筛查"]
        A3["异常复核"]
        A4["回访管理"]
        A5["报表中心"]
    end
    subgraph "数据层"
        B["Zustand 状态管理"]
        C["Mock 数据服务"]
    end
    A --> A1
    A --> A2
    A --> A3
    A --> A4
    A --> A5
    A1 --> B
    A2 --> B
    A3 --> B
    A4 --> B
    A5 --> B
    B --> C
```

## 2. 技术说明

- **前端**：React@18 + TypeScript + Tailwind CSS@3 + Vite
- **初始化工具**：vite-init (react-ts 模板)
- **后端**：无后端，使用 Mock 数据
- **数据库**：无数据库，前端内置模拟数据
- **状态管理**：Zustand
- **图表库**：Recharts
- **图标库**：lucide-react
- **路由**：react-router-dom v6

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 重定向到 /dashboard |
| /dashboard | 机构看板，全局指标概览与预警 |
| /screening | 病例筛查，多条件筛选与高风险病例识别 |
| /review | 异常复核，附件/托槽异常、复诊记录抽查、照片缺失检查 |
| /followup | 回访管理，任务安排与满意度记录 |
| /reports | 报表中心，月度质控清单与督办备注 |

## 4. 数据模型

### 4.1 数据模型定义

```mermaid
erDiagram
    "门店" {
        string id PK
        string name
        string address
        int activePatients
        int monthlyNew
        int overdueCount
        int anomalyCount
    }
    "医生" {
        string id PK
        string name
        string storeId FK
        int activePatients
        int planChanges
        float avgInterval
    }
    "病例" {
        string id PK
        string patientName
        string doctorId FK
        string storeId FK
        string stage
        string status
        int planChangeCount
        float daysInTreatment
        float lastVisitDays
        boolean isOverdue
        boolean isHighRisk
    }
    "异常记录" {
        string id PK
        string caseId FK
        string type
        string description
        string storeId FK
        string date
        boolean resolved
    }
    "回访任务" {
        string id PK
        string caseId FK
        string assignedTo
        string status
        string priority
        string dueDate
        string satisfaction
        string refundTendency
        string notes
    }
    "督办备注" {
        string id PK
        string title
        string content
        string assignedTo
        string status
        string createdAt
        string updatedAt
    }
    "门店" ||--o{ "医生" : "拥有"
    "医生" ||--o{ "病例" : "负责"
    "门店" ||--o{ "病例" : "归属"
    "病例" ||--o{ "异常记录" : "产生"
    "病例" ||--o{ "回访任务" : "关联"
```

### 4.2 数据定义

本项目采用前端 Mock 数据，数据定义在 `src/utils/mockData.ts` 中，包含：
- 5 个门店的基础数据
- 20 名医生的在治数据
- 200+ 病例的模拟数据（含不同阶段、状态、风险等级）
- 50+ 异常记录（附件丢失、托槽脱落、照片缺失等类型）
- 30+ 回访任务
- 月度质控清单模板数据
