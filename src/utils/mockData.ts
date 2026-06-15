import type {
  Store, Doctor, Case, AnomalyRecord, FollowupTask,
  SupervisionNote, QualityCheckItem, StageDuration,
} from '@/types'

export const stores: Store[] = [
  { id: 'S001', name: '瑞尔齿科·朝阳门店', address: '北京市朝阳区建国路88号', activePatients: 86, monthlyNew: 12, overdueCount: 8, anomalyCount: 5 },
  { id: 'S002', name: '瑞尔齿科·海淀店', address: '北京市海淀区中关村大街36号', activePatients: 72, monthlyNew: 9, overdueCount: 6, anomalyCount: 4 },
  { id: 'S003', name: '瑞尔齿科·西城店', address: '北京市西城区金融大街7号', activePatients: 63, monthlyNew: 8, overdueCount: 4, anomalyCount: 7 },
  { id: 'S004', name: '瑞尔齿科·浦东店', address: '上海市浦东新区陆家嘴环路1000号', activePatients: 91, monthlyNew: 14, overdueCount: 11, anomalyCount: 9 },
  { id: 'S005', name: '瑞尔齿科·天河店', address: '广州市天河区珠江新城华夏路', activePatients: 55, monthlyNew: 7, overdueCount: 3, anomalyCount: 2 },
]

export const doctors: Doctor[] = [
  { id: 'D001', name: '张伟明', storeId: 'S001', avatar: '', activePatients: 22, planChanges: 3, avgIntervalDays: 28 },
  { id: 'D002', name: '李芳华', storeId: 'S001', avatar: '', activePatients: 18, planChanges: 5, avgIntervalDays: 35 },
  { id: 'D003', name: '王思远', storeId: 'S001', avatar: '', activePatients: 25, planChanges: 2, avgIntervalDays: 26 },
  { id: 'D004', name: '陈雅琳', storeId: 'S001', avatar: '', activePatients: 21, planChanges: 4, avgIntervalDays: 31 },
  { id: 'D005', name: '刘建国', storeId: 'S002', avatar: '', activePatients: 19, planChanges: 6, avgIntervalDays: 38 },
  { id: 'D006', name: '赵敏', storeId: 'S002', avatar: '', activePatients: 16, planChanges: 1, avgIntervalDays: 25 },
  { id: 'D007', name: '孙浩然', storeId: 'S002', avatar: '', activePatients: 20, planChanges: 3, avgIntervalDays: 29 },
  { id: 'D008', name: '周丽娟', storeId: 'S002', avatar: '', activePatients: 17, planChanges: 2, avgIntervalDays: 27 },
  { id: 'D009', name: '吴晓峰', storeId: 'S003', avatar: '', activePatients: 15, planChanges: 4, avgIntervalDays: 33 },
  { id: 'D010', name: '郑婉清', storeId: 'S003', avatar: '', activePatients: 22, planChanges: 1, avgIntervalDays: 24 },
  { id: 'D011', name: '黄志强', storeId: 'S003', avatar: '', activePatients: 13, planChanges: 7, avgIntervalDays: 42 },
  { id: 'D012', name: '林美玲', storeId: 'S003', avatar: '', activePatients: 13, planChanges: 2, avgIntervalDays: 28 },
  { id: 'D013', name: '杨建华', storeId: 'S004', avatar: '', activePatients: 24, planChanges: 5, avgIntervalDays: 36 },
  { id: 'D014', name: '许文静', storeId: 'S004', avatar: '', activePatients: 23, planChanges: 3, avgIntervalDays: 30 },
  { id: 'D015', name: '何俊杰', storeId: 'S004', avatar: '', activePatients: 20, planChanges: 8, avgIntervalDays: 45 },
  { id: 'D016', name: '罗雅婷', storeId: 'S004', avatar: '', activePatients: 24, planChanges: 1, avgIntervalDays: 26 },
  { id: 'D017', name: '马天宇', storeId: 'S005', avatar: '', activePatients: 14, planChanges: 2, avgIntervalDays: 27 },
  { id: 'D018', name: '宋佳慧', storeId: 'S005', avatar: '', activePatients: 18, planChanges: 3, avgIntervalDays: 32 },
  { id: 'D019', name: '韩志远', storeId: 'S005', avatar: '', activePatients: 12, planChanges: 1, avgIntervalDays: 24 },
  { id: 'D020', name: '唐雅芳', storeId: 'S005', avatar: '', activePatients: 11, planChanges: 0, avgIntervalDays: 22 },
]

const stages: Case['stage'][] = ['初诊', '方案确认', '排齐阶段', '关缝阶段', '精细调整', '保持阶段']
const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
const givenNames = ['思远', '雅琳', '建国', '芳华', '伟明', '晓峰', '婉清', '志强', '美玲', '文静', '俊杰', '雅婷', '天宇', '佳慧', '志远', '雅芳', '浩然', '丽娟', '建华', '敏']

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rand = seededRandom(42)

export const cases: Case[] = Array.from({ length: 200 }, (_, i) => {
  const storeIdx = Math.floor(rand() * stores.length)
  const store = stores[storeIdx]
  const storeDoctors = doctors.filter(d => d.storeId === store.id)
  const doctor = storeDoctors[Math.floor(rand() * storeDoctors.length)]
  const stageIdx = Math.floor(rand() * stages.length)
  const planChanges = Math.floor(rand() * 6)
  const daysInTreatment = Math.floor(rand() * 600) + 30
  const lastVisitDays = Math.floor(rand() * 90) + 1
  const isOverdue = lastVisitDays > 42
  const isHighRisk = planChanges >= 3 || lastVisitDays > 56
  const gender = rand() > 0.5 ? '男' : '女' as const
  const surname = surnames[Math.floor(rand() * surnames.length)]
  const given = givenNames[Math.floor(rand() * givenNames.length)]

  return {
    id: `C${String(i + 1).padStart(4, '0')}`,
    patientName: surname + given,
    patientAge: Math.floor(rand() * 30) + 12,
    patientGender: gender,
    doctorId: doctor.id,
    storeId: store.id,
    stage: stages[stageIdx],
    status: rand() > 0.1 ? '在治' : (rand() > 0.5 ? '暂停' : '已完成'),
    planChangeCount: planChanges,
    daysInTreatment,
    lastVisitDays,
    isOverdue,
    isHighRisk,
    startDate: `2025-${String(Math.floor(rand() * 12) + 1).padStart(2, '0')}-${String(Math.floor(rand() * 28) + 1).padStart(2, '0')}`,
    lastVisitDate: `2026-${String(Math.floor(rand() * 6) + 1).padStart(2, '0')}-${String(Math.floor(rand() * 28) + 1).padStart(2, '0')}`,
    nextVisitDate: `2026-${String(Math.floor(rand() * 6) + 7).padStart(2, '0')}-${String(Math.floor(rand() * 28) + 1).padStart(2, '0')}`,
    notes: '',
  }
})

const anomalyTypes: AnomalyRecord['type'][] = ['附件丢失', '托槽脱落', '照片缺失', '复诊记录缺项', '方案多次变更']
const anomalyDescriptions: Record<AnomalyRecord['type'], string[]> = {
  '附件丢失': ['左上5号附件脱落', '右下3号附件缺失', '上前牙区附件松动脱落', '下颌双侧附件丢失'],
  '托槽脱落': ['右上2号托槽脱落', '左下4号托槽脱落需重新粘接', '上前牙托槽脱落2颗', '下颌磨牙区托槽脱落'],
  '照片缺失': ['更换弓丝节点照片未上传', '排齐阶段口内照缺失', '精调阶段面像照缺失', '保持器戴入照片未记录'],
  '复诊记录缺项': ['复诊记录缺少调整说明', '未记录弓丝更换型号', '缺少患者反馈记录', '复诊记录未签名'],
  '方案多次变更': ['方案第3次变更，原因未注明', '治疗方案由隐适美改为固定矫治', '拔牙方案变更2次', '关缝方式变更但未说明原因'],
}

export const anomalyRecords: AnomalyRecord[] = Array.from({ length: 60 }, (_, i) => {
  const type = anomalyTypes[Math.floor(rand() * anomalyTypes.length)]
  const descs = anomalyDescriptions[type]
  const storeIdx = Math.floor(rand() * stores.length)
  const store = stores[storeIdx]
  const storeDoctors = doctors.filter(d => d.storeId === store.id)
  const doctor = storeDoctors[Math.floor(rand() * storeDoctors.length)]
  const caseItem = cases.filter(c => c.doctorId === doctor.id)
  const c = caseItem[Math.floor(rand() * caseItem.length)] || cases[Math.floor(rand() * cases.length)]

  return {
    id: `A${String(i + 1).padStart(3, '0')}`,
    caseId: c.id,
    patientName: c.patientName,
    doctorId: doctor.id,
    storeId: store.id,
    type,
    description: descs[Math.floor(rand() * descs.length)],
    date: `2026-${String(Math.floor(rand() * 6) + 1).padStart(2, '0')}-${String(Math.floor(rand() * 28) + 1).padStart(2, '0')}`,
    resolved: rand() > 0.6,
    severity: rand() > 0.7 ? '高' : (rand() > 0.4 ? '中' : '低'),
  }
})

const assignees = ['陈运营', '刘督导', '王质控', '张主管', '李随访']

export const followupTasks: FollowupTask[] = Array.from({ length: 35 }, (_, i) => {
  const storeIdx = Math.floor(rand() * stores.length)
  const store = stores[storeIdx]
  const storeDoctors = doctors.filter(d => d.storeId === store.id)
  const doctor = storeDoctors[Math.floor(rand() * storeDoctors.length)]
  const caseItem = cases.filter(c => c.doctorId === doctor.id)
  const c = caseItem[Math.floor(rand() * caseItem.length)] || cases[Math.floor(rand() * cases.length)]
  const statusRand = rand()
  const status: FollowupTask['status'] = statusRand > 0.5 ? '待办' : (statusRand > 0.2 ? '进行中' : '已完成')
  const refundOptions: FollowupTask['refundTendency'][] = ['无', '低', '中', '高']

  return {
    id: `F${String(i + 1).padStart(3, '0')}`,
    caseId: c.id,
    patientName: c.patientName,
    storeId: store.id,
    assignedTo: assignees[Math.floor(rand() * assignees.length)],
    status,
    priority: rand() > 0.7 ? '高' : (rand() > 0.4 ? '中' : '低'),
    dueDate: `2026-${String(Math.floor(rand() * 3) + 6).padStart(2, '0')}-${String(Math.floor(rand() * 28) + 1).padStart(2, '0')}`,
    satisfaction: status === '已完成' ? Math.floor(rand() * 3) + 3 : null,
    refundTendency: status === '已完成' ? refundOptions[Math.floor(rand() * refundOptions.length)] : null,
    notes: status === '已完成' ? '患者表示理解，愿意继续配合治疗' : '',
    createdAt: `2026-${String(Math.floor(rand() * 6) + 1).padStart(2, '0')}-${String(Math.floor(rand() * 28) + 1).padStart(2, '0')}`,
    completedAt: status === '已完成' ? `2026-${String(Math.floor(rand() * 6) + 1).padStart(2, '0')}-${String(Math.floor(rand() * 28) + 1).padStart(2, '0')}` : null,
  }
})

export const supervisionNotes: SupervisionNote[] = [
  { id: 'SN001', title: '浦东店托槽脱落集中问题', content: '近2周浦东店托槽脱落事件达9起，需排查粘接流程是否合规，建议下周二前完成整改。', assignedTo: '王质控', status: '跟进中', priority: '高', createdAt: '2026-06-01', updatedAt: '2026-06-10', relatedStoreId: 'S004', relatedCaseId: null, relatedType: '托槽脱落' },
  { id: 'SN002', title: '西城店方案变更率偏高', content: '西城店本月方案变更率18.5%，远超均值10.2%，需核实变更原因是否合理。', assignedTo: '刘督导', status: '待处理', priority: '高', createdAt: '2026-06-03', updatedAt: '2026-06-03', relatedStoreId: 'S003', relatedCaseId: null, relatedType: '方案多次变更' },
  { id: 'SN003', title: '朝阳门店超期复诊跟进', content: '朝阳门店8例超期复诊患者，其中3例超过60天未回诊，需逐一电话跟进。', assignedTo: '陈运营', status: '跟进中', priority: '中', createdAt: '2026-06-05', updatedAt: '2026-06-12', relatedStoreId: 'S001', relatedCaseId: null, relatedType: '' },
  { id: 'SN004', title: '全门店照片上传规范提醒', content: '近1月各门店关键节点照片缺失率约15%，需重申照片上传规范，6月底前完成全员培训。', assignedTo: '张主管', status: '待处理', priority: '中', createdAt: '2026-06-08', updatedAt: '2026-06-08', relatedStoreId: null, relatedCaseId: null, relatedType: '照片缺失' },
  { id: 'SN005', title: '海淀店复诊记录完整度整改', content: '海淀店复诊记录缺项率22%，主要缺失弓丝型号和患者反馈，已通知该店6月20日前完成整改。', assignedTo: '刘督导', status: '已关闭', priority: '中', createdAt: '2026-05-20', updatedAt: '2026-06-05', relatedStoreId: 'S002', relatedCaseId: null, relatedType: '复诊记录缺项' },
  { id: 'SN006', title: '天河店满意度调查异常', content: '天河店5月患者满意度评分3.2/5，低于均值4.1，退费倾向标记2例，需深入了解原因。', assignedTo: '李随访', status: '跟进中', priority: '高', createdAt: '2026-06-10', updatedAt: '2026-06-14', relatedStoreId: 'S005', relatedCaseId: null, relatedType: '' },
  { id: 'SN007', title: '何俊杰医生方案变更审核', content: '何俊杰医生在治24例中8例方案变更≥3次，需逐一审核变更合理性。', assignedTo: '王质控', status: '待处理', priority: '高', createdAt: '2026-06-12', updatedAt: '2026-06-12', relatedStoreId: 'S004', relatedCaseId: null, relatedType: '方案多次变更' },
  { id: 'SN008', title: '月度附件丢失率汇总', content: '5月全部门店附件丢失率3.8%，较4月上升0.6个百分点，需持续关注趋势。', assignedTo: '张主管', status: '已关闭', priority: '低', createdAt: '2026-06-01', updatedAt: '2026-06-08', relatedStoreId: null, relatedCaseId: null, relatedType: '附件丢失' },
]

export const qualityCheckItems: QualityCheckItem[] = [
  { id: 'Q001', category: '复诊及时性', item: '超期未复诊率', standard: '≤8%', status: '未达标', storeId: 'S004', details: '浦东店超期未复诊率12.1%', month: '2026-06' },
  { id: 'Q002', category: '复诊及时性', item: '超期未复诊率', standard: '≤8%', status: '达标', storeId: 'S001', details: '朝阳门店超期未复诊率9.3%', month: '2026-06' },
  { id: 'Q003', category: '方案稳定性', item: '方案变更率', standard: '≤10%', status: '未达标', storeId: 'S003', details: '西城店方案变更率18.5%', month: '2026-06' },
  { id: 'Q004', category: '方案稳定性', item: '方案变更率', standard: '≤10%', status: '达标', storeId: 'S005', details: '天河店方案变更率5.5%', month: '2026-06' },
  { id: 'Q005', category: '记录完整度', item: '复诊记录完整率', standard: '≥95%', status: '未达标', storeId: 'S002', details: '海淀店复诊记录完整率78%', month: '2026-06' },
  { id: 'Q006', category: '记录完整度', item: '复诊记录完整率', standard: '≥95%', status: '达标', storeId: 'S005', details: '天河店复诊记录完整率97.2%', month: '2026-06' },
  { id: 'Q007', category: '影像管理', item: '关键节点照片上传率', standard: '≥90%', status: '未达标', storeId: 'S004', details: '浦东店照片上传率82%', month: '2026-06' },
  { id: 'Q008', category: '影像管理', item: '关键节点照片上传率', standard: '≥90%', status: '达标', storeId: 'S001', details: '朝阳门店照片上传率93.5%', month: '2026-06' },
  { id: 'Q009', category: '附件管理', item: '附件丢失率', standard: '≤3%', status: '未达标', storeId: 'S003', details: '西城店附件丢失率5.2%', month: '2026-06' },
  { id: 'Q010', category: '附件管理', item: '附件丢失率', standard: '≤3%', status: '达标', storeId: 'S005', details: '天河店附件丢失率1.8%', month: '2026-06' },
  { id: 'Q011', category: '托槽管理', item: '托槽脱落率', standard: '≤4%', status: '未达标', storeId: 'S004', details: '浦东店托槽脱落率6.7%', month: '2026-06' },
  { id: 'Q012', category: '托槽管理', item: '托槽脱落率', standard: '≤4%', status: '达标', storeId: 'S002', details: '海淀店托槽脱落率3.1%', month: '2026-06' },
  { id: 'Q013', category: '患者满意度', item: '平均满意度评分', standard: '≥4.0/5', status: '未达标', storeId: 'S005', details: '天河店平均满意度3.2', month: '2026-06' },
  { id: 'Q014', category: '患者满意度', item: '平均满意度评分', standard: '≥4.0/5', status: '达标', storeId: 'S001', details: '朝阳门店平均满意度4.3', month: '2026-06' },
  { id: 'Q015', category: '退费管控', item: '退费率', standard: '≤2%', status: '达标', storeId: 'S001', details: '朝阳门店退费率1.2%', month: '2026-06' },
  { id: 'Q016', category: '退费管控', item: '退费率', standard: '≤2%', status: '达标', storeId: 'S002', details: '海淀店退费率0.8%', month: '2026-06' },
  { id: 'Q017', category: '依从性', item: '患者依从性评分', standard: '≥85分', status: '达标', storeId: 'S005', details: '天河店依从性评分88分', month: '2026-06' },
  { id: 'Q018', category: '依从性', item: '患者依从性评分', standard: '≥85分', status: '未达标', storeId: 'S003', details: '西城店依从性评分79分', month: '2026-06' },
  { id: 'Q019', category: '复诊及时性', item: '平均复诊间隔', standard: '≤30天', status: '未达标', storeId: 'S004', details: '浦东店平均复诊间隔36天', month: '2026-06' },
  { id: 'Q020', category: '复诊及时性', item: '平均复诊间隔', standard: '≤30天', status: '达标', storeId: 'S005', details: '天河店平均复诊间隔26天', month: '2026-06' },
]

export const stageDurations: StageDuration[] = [
  { stage: '初诊', avgDays: 14, standardDays: 14, caseCount: 200 },
  { stage: '方案确认', avgDays: 21, standardDays: 18, caseCount: 185 },
  { stage: '排齐阶段', avgDays: 168, standardDays: 150, caseCount: 142 },
  { stage: '关缝阶段', avgDays: 125, standardDays: 120, caseCount: 98 },
  { stage: '精细调整', avgDays: 78, standardDays: 60, caseCount: 56 },
  { stage: '保持阶段', avgDays: 365, standardDays: 365, caseCount: 23 },
]

export const trendData = [
  { month: '2026-01', activePatients: 320, overdueCount: 22, anomalyCount: 12 },
  { month: '2026-02', activePatients: 335, overdueCount: 25, anomalyCount: 15 },
  { month: '2026-03', activePatients: 348, overdueCount: 28, anomalyCount: 18 },
  { month: '2026-04', activePatients: 355, overdueCount: 30, anomalyCount: 21 },
  { month: '2026-05', activePatients: 362, overdueCount: 32, anomalyCount: 24 },
  { month: '2026-06', activePatients: 367, overdueCount: 32, anomalyCount: 27 },
]

export const complianceData = [
  { store: '朝阳门店', attendance: 92, photoUpload: 93, recordComplete: 96, planStability: 88, satisfaction: 86 },
  { store: '海淀店', attendance: 88, photoUpload: 90, recordComplete: 78, planStability: 91, satisfaction: 89 },
  { store: '西城店', attendance: 85, photoUpload: 87, recordComplete: 92, planStability: 72, satisfaction: 82 },
  { store: '浦东店', attendance: 78, photoUpload: 82, recordComplete: 85, planStability: 80, satisfaction: 76 },
  { store: '天河店', attendance: 94, photoUpload: 96, recordComplete: 97, planStability: 95, satisfaction: 72 },
]

export const anomalyHeatmapData = (() => {
  const types = ['附件丢失', '托槽脱落', '照片缺失', '复诊记录缺项']
  const result: { store: string; type: string; count: number }[] = []
  stores.forEach(store => {
    types.forEach(type => {
      result.push({
        store: store.name.replace('瑞尔齿科·', ''),
        type,
        count: anomalyRecords.filter(a => a.storeId === store.id && a.type === type).length,
      })
    })
  })
  return result
})()

export const alerts = [
  { id: 1, type: 'overdue' as const, message: '浦东店 超期未复诊病例达11例', time: '2分钟前' },
  { id: 2, type: 'risk' as const, message: '何俊杰医生8例方案变更≥3次', time: '15分钟前' },
  { id: 3, type: 'anomaly' as const, message: '西城店 附件丢失率5.2%超标', time: '1小时前' },
  { id: 4, type: 'overdue' as const, message: '朝阳门店3例超60天未回诊', time: '2小时前' },
  { id: 5, type: 'anomaly' as const, message: '浦东店 托槽脱落率6.7%超标', time: '3小时前' },
  { id: 6, type: 'risk' as const, message: '西城店方案变更率18.5%远超均值', time: '4小时前' },
]

export function getStoreName(storeId: string): string {
  return stores.find(s => s.id === storeId)?.name.replace('瑞尔齿科·', '') || storeId
}

export function getDoctorName(doctorId: string): string {
  return doctors.find(d => d.id === doctorId)?.name || doctorId
}
