export interface Store {
  id: string
  name: string
  address: string
  activePatients: number
  monthlyNew: number
  overdueCount: number
  anomalyCount: number
}

export interface Doctor {
  id: string
  name: string
  storeId: string
  avatar: string
  activePatients: number
  planChanges: number
  avgIntervalDays: number
}

export type TreatmentStage = '初诊' | '方案确认' | '排齐阶段' | '关缝阶段' | '精细调整' | '保持阶段'
export type CaseStatus = '在治' | '已完成' | '暂停' | '已退费'
export type Priority = '高' | '中' | '低'
export type FollowupStatus = '待办' | '进行中' | '已完成'
export type AnomalyType = '附件丢失' | '托槽脱落' | '照片缺失' | '复诊记录缺项' | '方案多次变更'
export type SupervisionStatus = '待处理' | '跟进中' | '已关闭'

export interface Case {
  id: string
  patientName: string
  patientAge: number
  patientGender: '男' | '女'
  doctorId: string
  storeId: string
  stage: TreatmentStage
  status: CaseStatus
  planChangeCount: number
  daysInTreatment: number
  lastVisitDays: number
  isOverdue: boolean
  isHighRisk: boolean
  startDate: string
  lastVisitDate: string
  nextVisitDate: string
  notes: string
}

export interface AnomalyRecord {
  id: string
  caseId: string
  patientName: string
  doctorId: string
  storeId: string
  type: AnomalyType
  description: string
  date: string
  resolved: boolean
  severity: '高' | '中' | '低'
}

export interface FollowupTask {
  id: string
  caseId: string
  patientName: string
  storeId: string
  assignedTo: string
  status: FollowupStatus
  priority: Priority
  dueDate: string
  satisfaction: number | null
  refundTendency: '无' | '低' | '中' | '高' | null
  notes: string
  createdAt: string
  completedAt: string | null
}

export interface SupervisionNote {
  id: string
  title: string
  content: string
  assignedTo: string
  status: SupervisionStatus
  priority: Priority
  createdAt: string
  updatedAt: string
  relatedStoreId: string | null
}

export interface QualityCheckItem {
  id: string
  category: string
  item: string
  standard: string
  status: '达标' | '未达标' | '待检查'
  storeId: string
  details: string
  month: string
}

export interface StageDuration {
  stage: TreatmentStage
  avgDays: number
  standardDays: number
  caseCount: number
}
