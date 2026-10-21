'use client';

import { useEffect, useState } from 'react';

type Language = 'en' | 'zh' | 'ko';
type TranslationPair = [string, string];
type LanguageMeta = {
    htmlLang: string;
    locale: string;
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
};

const languageMeta: Record<Language, LanguageMeta> = {
    en: {
        htmlLang: 'en',
        locale: 'en_US',
        title: 'SYRM | Real-World Demonstration Data for Physical AI',
        description:
            'SYRM captures real-world human demonstrations across physical tasks and environments, delivering structured multimodal datasets for robotics, embodied AI, and physical AI training pipelines.',
        ogTitle: 'SYRM | Real-World Demonstration Data for Physical AI',
        ogDescription:
            'Human demonstrations from real environments, collected to spec and organized into structured datasets for robotics and embodied AI teams.',
    },
    zh: {
        htmlLang: 'zh-CN',
        locale: 'zh_CN',
        title: 'SYRM | 面向物理 AI 的真实世界示范数据',
        description:
            'SYRM 在真实任务与真实环境中采集人类示范，并为机器人、具身智能和物理 AI 训练流程交付结构化多模态数据集。',
        ogTitle: 'SYRM | 面向物理 AI 的真实世界示范数据',
        ogDescription:
            '按规格采集真实环境中的人类示范，并整理为面向机器人与具身智能团队的结构化数据集。',
    },
    ko: {
        htmlLang: 'ko',
        locale: 'ko_KR',
        title: 'SYRM | 피지컬 AI를 위한 현실 세계 시연 데이터',
        description:
            'SYRM은 실제 작업과 환경에서 인간 시연을 수집하고 로보틱스, 임바디드 AI, 피지컬 AI 학습 파이프라인을 위한 구조화된 멀티모달 데이터셋을 제공합니다.',
        ogTitle: 'SYRM | 피지컬 AI를 위한 현실 세계 시연 데이터',
        ogDescription:
            '실제 환경의 인간 시연을 요구 사양에 맞춰 수집하고 로보틱스 및 임바디드 AI 팀을 위한 구조화된 데이터셋으로 제공합니다.',
    },
};

const productionOrigin = 'https://www.syrm.ai';
const languagePaths: Record<Language, string> = {
    en: '/en/',
    zh: '/cn/',
    ko: '/ko/',
};

const translations: Record<string, TranslationPair> = {
    'Story': ['故事', '스토리'],
    'Coverage': ['采集范围', '수집 분야'],
    'About': ['关于', '소개'],
    'Datasets': ['数据集', '데이터셋'],
    'About Us': ['关于我们', '회사 소개'],
    'ABOUT US': ['关于我们', '회사 소개'],
    'The collection operation': ['数据背后的', '데이터 뒤의'],
    'behind the data': ['采集运营', '수집 운영'],
    'Physical-AI teams need demonstrations that reflect how people actually work: varied tools, layouts, objects, and routines. SYRM runs the operational layer behind that data. We source and brief demonstrators, organize real-world sessions, manage capture, and review delivery sets against the collection specification.': [
        '物理 AI 团队需要能够反映人类真实工作方式的示范：多样的工具、布局、物体与流程。SYRM 承担数据背后的运营层：我们招募并培训示范人员、组织真实场景采集、管理拍摄全过程，并严格按照采集规格审核交付数据。',
        '피지컬 AI 팀은 다양한 도구, 작업 환경, 사물 및 루틴 등 실제 사람들의 작업 방식을 온전히 반영한 시연 데이터가 필요합니다. SYRM은 이러한 데이터 이면의 운영 계층을 총괄합니다. 시연자 섭외 및 브리핑부터 실제 현장 세션 구성, 캡처 관리, 수집 사양에 맞춘 최종 납품 데이터셋 검수까지 전 과정을 직접 수행합니다.',
    ],
    'Request Datasets': ['申请数据集', '데이터셋 요청'],
    'Request Datasets ↗': ['申请数据集 ↗', '데이터셋 요청 ↗'],
    'Food & Home': ['食品与家庭', '식품 및 가정'],
    'Industry & Workshop': ['工业与工坊', '산업 및 작업장'],
    'Field & Infrastructure': ['现场与基础设施', '현장 및 인프라'],
    'People & Service': ['人员与服务', '인력 및 서비스'],
    'Dexterous Manipulation': ['灵巧操作', '정밀 조작'],
    'Specialized Environments': ['特殊环境', '특수 환경'],
    'Click to enlarge': ['点击放大', '클릭하여 확대'],
    'Cleaning & Sanitation': ['清洁与卫生', '청소 및 위생'],
    'Food Processing': ['食品加工', '식품 가공'],
    'Food & Beverage': ['食品与饮料', '식음료'],
    'Manufacturing': ['制造业', '제조업'],
    'Sorting & Packing': ['分拣与包装', '분류 및 포장'],
    'Folding & Textile Work': ['折叠与纺织作业', '접기 및 섬유 작업'],
    'Washing Carpet': ['清洗地毯', '카펫 세척'],
    'Chopping Chinese Cabbage': ['切白菜', '배추 썰기'],
    'Making Iced Tea': ['制作冰茶', '아이스티 만들기'],
    'Making Banana Bolen Pastry': ['制作香蕉酥皮点心', '바나나 볼렌 페이스트리 만들기'],
    'Screen Printing Caps': ['帽子丝网印刷', '모자 실크스크린 인쇄'],
    'Screen Printing Tote Bags': ['帆布包丝网印刷', '에코백 실크스크린 인쇄'],
    'Curling Eyelashes': ['卷睫毛', '속눈썹 롤링'],
    'Wrapping Kerupuk Crackers': ['包装虾片', '크루푹 과자 포장'],
    'Folding Umbrella': ['折叠雨伞', '우산 접기'],
    'Human demonstrations in culinary prep, commercial kitchens, food processing, and cleaning.': [
        '在烹饪预备、商用厨房、食品加工与清洁环境中的人类示范。',
        '요리 준비, 상업용 주방, 식품 가공 및 청소 환경에서의 사람 시연 데이터입니다.',
    ],
    'Specialized industrial craftsmanship, fabrication line tasks, and precision manual manufacturing.': [
        '专业工业工艺、制造流水线作业与精密手工制造。',
        '전문 산업 공예, 제조 라인 작업 및 정밀 수작업 제조 데이터입니다.',
    ],
    'High-frequency finger articulation, deformable object folding, and sub-millimeter hand pose tasks.': [
        '高频手指灵巧运动、可形变物体折叠与亚毫米级手势任务。',
        '고빈도 손가락 관절 움직임, 변형 가능한 물체 접기 및 서브밀리미터 수준의 손 자세 작업입니다.',
    ],
    'First-person perspective manual carpet cleaning, deep rotary shampooing, and water extraction on floor rugs.': [
        '第一人称视角手工地毯清洗、深度旋转刷洗与地毯抽水作业。',
        '1인칭 시점의 수작업 카펫 청소, 딥 로터리 샴푸 작업 및 러그 수분 추출 과정입니다.',
    ],
    'Knife grip kinematics, precise slicing rhythm, and systematic chopping of Chinese cabbage leaves.': [
        '运刀抓握运动学、精准切片节奏以及系统化的白菜叶切碎作业。',
        '칼 그립 기구학, 정밀한 썰기 리듬, 체계적인 배추 잎 썰기 과정입니다.',
    ],
    'Beverage ingredient pouring, sugar syrup dissolution stirring, ice scoop transfer, and liquid leveling.': [
        '饮料原料倾倒、糖浆溶解搅拌、冰块舀取转移以及液面调平。',
        '음료 재료 붓기, 시럽 용해 교반, 얼음 스쿱 이동 및 액체 레벨 조절 과정입니다.',
    ],
    'Artisan pastry rolling, banana and cheese filling wrapping, edge tucking, and tray arrangement for baking.': [
        '手工酥皮擀压、香蕉与芝士馅料包裹、折边封口以及烘焙托盘码放。',
        '장인식 페이스트리 밀기, 바나나 및 치즈 소 감싸기, 모서리 접기 및 베이킹 트레이 정렬 과정입니다.',
    ],
    'Curved surface screen printing on headwear with manual screen alignment and squeegee pressure control.': [
        '帽类弧面丝网印刷，配合手动网版对位与刮刀压力控制。',
        '수동 스크린 정렬 및 스퀴지 압력 제어를 통한 모자 곡면 실크스크린 인쇄입니다.',
    ],
    'Fabric tote bag manual screen printing with registration alignment and continuous ink stroke.': [
        '帆布手提包手工丝网印刷，包含对位套印与连续均匀刮墨。',
        '정렬 맞춤과 연속 잉크 스트로크를 활용한 패브릭 토트백 수동 실크스크린 인쇄입니다.',
    ],
    'Micro-dexterity eyelash rolling and delicate curling around heated cylindrical mandrels.': [
        '围绕加热圆柱芯轴进行的高灵巧度睫毛卷绕与精细卷翘作业。',
        '가열된 원통형 맨드릴 주위로 정밀하게 속눈썹을 롤링하고 섬세하게 컬링하는 작업입니다.',
    ],
    'Bimanual sorting and rapid food snack packaging into thin polymer wrappers with hand-twist sealing.': [
        '双手协同分拣以及将膨化零食快速装入超薄塑料包装袋并手动拧紧封口。',
        '양손 분류 및 얇은 폴리머 포장지에 스낵을 빠르게 넣고 손으로 비틀어 밀봉하는 작업입니다.',
    ],
    'Multi-step manual rib folding, fabric tensioning, spine alignment, and strap securing for umbrellas.': [
        '多步骤手工伞骨折叠、伞布张紧、中棒对齐以及绑带固定。',
        '우산 살대 다단계 접기, 원단 장력 조절, 중심축 정렬 및 스트랩 고정 과정입니다.',
    ],
    'Request this dataset ↗': ['申请此数据集 ↗', '이 데이터셋 요청 ↗'],
    'Previous videos': ['上一个视频', '이전 동영상'],
    'Next videos': ['下一个视频', '다음 동영상'],
    'Pause video': ['暂停视频', '동영상 일시정지'],
    'Unmute video': ['开启声音', '음소거 해제'],
    'Mute video': ['静音视频', '동영상 음소거'],
    'Fullscreen': ['全屏', '전체 화면'],
    'Contact': ['联系', '문의'],
    'Email': ['邮箱', '이메일'],
    'Start a collection': ['开始采集', '수집 시작'],
    'Collective Intelligence in Real Motion': ['真实运动中的集体智能', '실제 움직임 속 집단 지능'],
    'Real-world data collection at scale.': ['规模化真实世界数据采集。', '대규모 현실 세계 데이터 수집.'],
    'COLLECTIVE INTELLIGENCE IN MOTION': ['运动中的集体智能', '움직임 속 집단 지능'],
    'Real human data.': ['真实的人类数据。', '실제 인간 데이터.'],
    'For the next generation of intelligence.': ['为下一代智能而生。', '차세대 지능을 위해.'],
    'Human demonstrations across real tasks and environments, captured reliably to your specification.': [
        '按照您的规格，可靠采集真实任务和环境中的人类示范。',
        '요구 사양에 맞춰 실제 작업과 환경에서 사람의 시연을 안정적으로 수집합니다.',
    ],
    'OPERATIONS': ['运营', '운영'],
    'Your collection engine': ['您的数据采集引擎', '여러분의 데이터 수집 엔진'],
    'in the real world.': ['扎根真实世界。', '현실 세계에서.'],
    'Your task list, capture rules, and quality thresholds. Our trained demonstrators, environments, supervision, and recurring delivery operation.': [
        '您的任务清单、采集规则和质量标准。我们的示范人员、场景、监督与持续交付机制。',
        '작업 목록, 수집 규칙, 품질 기준에 맞춰 숙련된 시연자, 환경, 감독, 정기 납품 운영을 제공합니다.',
    ],
    'DATA STEWARDSHIP': ['数据治理', '데이터 관리'],
    'Collected with integrity.': ['以诚信采集。', '정직하게 수집합니다.'],
    'Delivered with exclusivity.': ['专属交付。', '독점적으로 제공합니다.'],
    'Every program is collected for a defined client purpose, governed with privacy safeguards, and delivered without resale.': [
        '每个项目都服务于明确的客户目的，在隐私保护下治理，并且不会转售。',
        '모든 프로그램은 명확한 고객 목적에 맞춰 수집되며, 개인정보 보호 기준 아래 관리되고 재판매 없이 제공됩니다.',
    ],
    'COVERAGE': ['覆盖范围', '커버리지'],
    'The diversity of the real world.': ['真实世界的多样性。', '현실 세계의 다양성.'],
    'Captured.': ['被采集。', '수집합니다.'],
    'Across tasks, environments, and industries, we build diverse collection programs around the real work your systems need to understand.': [
        '跨越任务、环境与行业，我们围绕系统需要理解的真实工作构建多样化采集项目。',
        '작업, 환경, 산업 전반에서 시스템이 이해해야 하는 실제 업무를 중심으로 다양한 수집 프로그램을 구축합니다.',
    ],
    'The collection network comes forward—six categories at a time.': [
        '采集网络逐步展开——每次呈现六个类别。',
        '수집 네트워크가 여섯 개 카테고리씩 전면에 나타납니다.',
    ],
    'Collection categories': ['采集类别', '수집 카테고리'],
    'PEOPLE + SERVICE': ['人员 + 服务', '사람 + 서비스'],
    'FOOD + HOME': ['食品 + 家庭', '음식 + 생활'],
    'INDUSTRY + WORKSHOP': ['工业 + 工坊', '산업 + 작업장'],
    'FIELD + INFRASTRUCTURE': ['现场 + 基础设施', '현장 + 인프라'],
    'DEXTEROUS MANIPULATION': ['灵巧操作', '정교한 조작'],
    'SPECIALIZED ENVIRONMENTS': ['专业环境', '특수 환경'],
    'THE COMPLETE FIELD': ['完整领域', '전체 분야'],
    'Care, service, and everyday work.': ['照护、服务与日常工作。', '돌봄, 서비스, 일상 업무.'],
    'Human-centered routines with fine motor actions, tools, objects, and changing context.': [
        '以人为中心的流程，包含精细动作、工具、物体和变化的上下文。',
        '섬세한 동작, 도구, 물체, 변화하는 맥락이 담긴 인간 중심 루틴입니다.',
    ],
    'The physical intelligence of daily life.': ['日常生活中的物理智能。', '일상생활의 물리적 지능.'],
    'High-variation tasks where sequence, dexterity, and object interaction happen naturally.': [
        '高变化度任务，序列、灵巧性与物体交互自然发生。',
        '순서, 손재주, 물체 상호작용이 자연스럽게 발생하는 고변동 작업입니다.',
    ],
    'Workflows shaped by tools and precision.': ['由工具与精度塑造的工作流。', '도구와 정밀함이 만드는 워크플로입니다.'],
    'Structured and long-tail activity across industrial, technical, and production environments.': [
        '覆盖工业、技术与生产环境中的结构化和长尾活动。',
        '산업, 기술, 생산 환경 전반의 구조화된 롱테일 활동입니다.',
    ],
    'Real work in changing environments.': ['变化环境中的真实工作。', '변화하는 환경 속 실제 작업.'],
    'Outdoor and distributed workflows where terrain, weather, equipment, and context naturally vary.': [
        '户外和分布式工作流，地形、天气、设备与上下文自然变化。',
        '지형, 날씨, 장비, 맥락이 자연스럽게 달라지는 야외 및 분산형 워크플로입니다.',
    ],
    'The actions behind physical intelligence.': ['物理智能背后的动作。', '물리적 지능을 만드는 행동.'],
    'Reusable manipulation skills collected across objects, tools, materials, and levels of precision.': [
        '跨物体、工具、材料和精度等级采集可复用的操作技能。',
        '물체, 도구, 재료, 정밀도 수준 전반에서 재사용 가능한 조작 기술을 수집합니다.',
    ],
    'From careful craft to complex operations.': ['从精细工艺到复杂操作。', '섬세한 공예부터 복잡한 운영까지.'],
    'Domain-specific workflows captured with the context and variation robot learning requires.': [
        '在机器人学习所需的上下文与变化中采集领域专属工作流。',
        '로봇 학습에 필요한 맥락과 변화를 포함해 도메인별 워크플로를 수집합니다.',
    ],
    '36 categories. One collection network.': ['36 个类别。一个采集网络。', '36개 카테고리. 하나의 수집 네트워크.'],
    'A single operating system for capturing diverse human work across the real world.': [
        '一个用于采集真实世界多样化人类工作的运营系统。',
        '현실 세계의 다양한 인간 작업을 수집하기 위한 하나의 운영 체계입니다.',
    ],
    'Brand story': ['品牌故事', '브랜드 스토리'],
    'The meaning behind SYRM': ['SYRM 名称背后的含义', 'SYRM 이름에 담긴 의미'],
    'Our name is inspired by': ['我们的名字灵感来自', '우리 이름은'],
    ', the Sundanese word for ant.': ['，这是巽他语中“蚂蚁”的意思。', '라는 순다어 단어에서 영감을 받았습니다. 그 뜻은 개미입니다.'],
    'Individual actions.': ['个体行动。', '개별 행동.'],
    'Collective intelligence.': ['集体智能。', '집단 지능.'],
    'One ant is small. Together, a colony can accomplish something remarkable. We believe human experience holds the same collective potential: individual actions, brought together, become something greater.': [
        '一只蚂蚁很小。聚在一起，一个群体却能完成非凡的事情。我们相信，人类经验也拥有同样的集体潜能：个体行动汇聚起来，就会成为更强大的东西。',
        '개미 한 마리는 작습니다. 하지만 군집은 놀라운 일을 해낼 수 있습니다. 우리는 인간 경험에도 같은 집단적 가능성이 있다고 믿습니다. 개별 행동이 모이면 더 큰 무언가가 됩니다.',
    ],
    'At SYRM, we collect those actions from the real world—turning everyday demonstrations into a shared foundation for useful intelligence.': [
        '在 SYRM，我们从真实世界采集这些行动，把日常示范转化为有用智能的共享基础。',
        'SYRM은 현실 세계의 이러한 행동을 수집해 일상적인 시연을 유용한 지능을 위한 공유 기반으로 전환합니다.',
    ],
    'At SYRM, we collect those actions from the real world-turning everyday demonstrations into a shared foundation for useful intelligence.': [
        '在 SYRM，我们从真实世界采集这些行动，把日常示范转化为有用智能的共享基础。',
        'SYRM은 현실 세계의 이러한 행동을 수집해 일상적인 시연을 유용한 지능을 위한 공유 기반으로 전환합니다.',
    ],
    'FEATURED DATASETS': ['精选数据集', '주요 데이터셋'],
    'Featured data captures.': ['精选数据采集案例。', '주요 데이터 캡처.'],
    'A compact sample of the task categories and specifications SYRM can collect, organize, and review for training pipelines.': [
        '这是 SYRM 可为训练流程采集、整理和审核的任务类别与规格样本。',
        'SYRM이 학습 파이프라인을 위해 수집, 정리, 검수할 수 있는 작업 카테고리와 사양의 압축 샘플입니다.',
    ],
    'View capture example': ['查看采集示例', '캡처 예시 보기'],
    'Precision Clothes Sewing & Industrial Garment Seam Assembly': ['精密服装缝制与工业衣片缝合组装', '정밀 의류 봉제 및 산업용 의류 솔기 조립'],
    'First-person egocentric capture of precision garment sewing: handling delicate fabric panels, bimanual tension alignment under mechanical sewing machine needle strokes, edge seam guidance, and hem finishing.': [
        '精密服装缝制的第一视角采集：处理细致布片、在机械缝纫机针脚下进行双手张力对齐、边缘缝线引导和下摆收尾。',
        '정밀 의류 봉제의 1인칭 캡처: 섬세한 원단 패널 처리, 재봉틀 바늘 동작 아래 양손 장력 정렬, 가장자리 솔기 가이드, 밑단 마감.',
    ],
    'First-person capture of garment sewing: fabric handling, bimanual tension alignment, machine guidance, and hem finishing.': [
        '服装缝制的第一视角采集：布料处理、双手张力对齐、机器引导和下摆收尾。',
        '의류 봉제의 1인칭 캡처: 원단 처리, 양손 장력 정렬, 기계 가이드, 밑단 마감.',
    ],
    'Custom Bag Screen Printing & Manual Squeegee Ink Transfer': ['定制包袋丝网印刷与手动刮刀油墨转印', '맞춤 가방 실크스크린 인쇄 및 수동 스퀴지 잉크 전사'],
    'First-person egocentric capture of manual screen printing on custom canvas tote bags: stencil screen registration, ink flood stroke, pressurized bimanual squeegee draw, and peel-off print inspection.': [
        '定制帆布托特包手工丝网印刷的第一视角采集：网版套准、铺墨、双手加压刮刀拉印和揭版后的印刷检查。',
        '맞춤 캔버스 토트백 수동 스크린 인쇄의 1인칭 캡처: 스텐실 스크린 위치 맞춤, 잉크 플러드 스트로크, 양손 압력 스퀴지 드로우, 박리 후 인쇄 검사.',
    ],
    'Manual screen printing on canvas bags: registration, ink flood stroke, squeegee draw, and print inspection.': [
        '帆布包手工丝网印刷：套准、铺墨、刮刀拉印和印刷检查。',
        '캔버스 가방 수동 스크린 인쇄: 위치 맞춤, 잉크 플러드 스트로크, 스퀴지 드로우, 인쇄 검사.',
    ],
    'Specialty Coffee Milk Steaming & Free-Pour Latte Art': ['精品咖啡奶泡蒸打与自由倒花', '스페셜티 커피 우유 스티밍 및 프리푸어 라떼 아트'],
    'High-dexterity egocentric barista demonstration: micro-foam milk steaming vortex, pitcher swirl aeration, high-pour liquid crema base integration, and close-surface free-pour rosette and tulip pattern formation.': [
        '高灵巧度咖啡师第一视角示范：微泡奶蒸打漩涡、拉花缸旋转融合、高位注入与油脂层融合，以及贴近液面的自由倒花形成玫瑰和郁金香图案。',
        '고숙련 바리스타 1인칭 시연: 마이크로폼 우유 스티밍 보텍스, 피처 스월 에어레이션, 높은 위치의 액체 크레마 베이스 통합, 표면 가까이에서 만드는 프리푸어 로제타와 튤립 패턴.',
    ],
    'High-dexterity barista demonstration with pitcher motion, cup angle, liquid flow, and foam pattern formation.': [
        '高灵巧度咖啡师示范，包含拉花缸运动、杯身角度、液体流动和奶泡图案形成。',
        '피처 움직임, 컵 각도, 액체 흐름, 폼 패턴 형성을 포함한 고숙련 바리스타 시연.',
    ],
    'Precision Garment Steam Ironing & Fabric Wrinkle Flattening': ['精密服装蒸汽熨烫与织物皱褶展平', '정밀 의류 스팀 다림질 및 원단 주름 펴기'],
    'Continuous first-person egocentric capture of professional garment ironing: fabric panel spread on board, left-hand stabilization and seam pulling, directional soleplate gliding with pressurized steam trigger, and collar/cuff finishing.': [
        '专业服装熨烫的连续第一视角采集：在熨衣板上铺展衣片、左手稳定并拉紧缝线、按压蒸汽触发器进行定向底板滑动，以及领口/袖口收尾。',
        '전문 의류 다림질의 연속 1인칭 캡처: 다림판 위 원단 패널 펼침, 왼손 안정화와 솔기 당김, 가압 스팀 트리거를 동반한 방향성 열판 글라이드, 칼라/커프 마감.',
    ],
    'Garment care capture covering panel spread, hand stabilization, directional steam glide, and crease checks.': [
        '服装护理采集，覆盖衣片铺展、手部稳定、定向蒸汽滑动和折痕检查。',
        '패널 펼침, 손 안정화, 방향성 스팀 글라이드, 주름 검사를 포함한 의류 관리 캡처.',
    ],
    'Lawn Trimming, Grass Boundary Cutting & Groundskeeping': ['草坪修剪、草边切割与庭院维护', '잔디 다듬기, 경계 절단 및 조경 관리'],
    'Outdoor egocentric capture of manual groundskeeping and lawn maintenance: two-handed string trimmer balance, rhythmic sweeping pass, grass height leveling, perimeter fence clearing, and sidewalk curb edging.': [
        '户外人工庭院维护与草坪养护的第一视角采集：双手保持打草机平衡、有节奏的扫掠通过、草高找平、围栏边界清理和人行道边缘修整。',
        '수동 조경 및 잔디 관리의 야외 1인칭 캡처: 양손 스트링 트리머 균형, 리듬 있는 스위핑 패스, 잔디 높이 평탄화, 울타리 주변 정리, 보도 경계 다듬기.',
    ],
    'Outdoor groundskeeping capture with trimmer balance, sweeping passes, obstacle boundaries, and edge finishing.': [
        '户外庭院维护采集，包含修草机平衡、扫掠式通过、障碍边界和边缘收尾。',
        '트리머 균형, 스위핑 패스, 장애물 경계, 가장자리 마감을 포함한 야외 조경 캡처.',
    ],
    'Traditional Naan Bread Baking & High-Heat Stovetop Griddling': ['传统馕饼烘烤与高温炉面煎烤', '전통 난 빵 굽기 및 고열 스토브 그리들 조리'],
    'First-person egocentric capture of naan-style flatbread preparation: palm dough flattening, bimanual stretching, high-heat griddle adhesion, blister formation monitoring, and rapid flip/toast finishing.': [
        '馕式扁面包制作的第一视角采集：手掌压平面团、双手拉伸、高温炉面贴合、鼓泡形成观察，以及快速翻面/烘烤收尾。',
        '난 스타일 플랫브레드 준비의 1인칭 캡처: 손바닥 반죽 평탄화, 양손 스트레칭, 고열 그리들 접착, 기포 형성 모니터링, 빠른 뒤집기/토스팅 마감.',
    ],
    'Culinary demonstration of dough shaping, griddle placement, blister monitoring, flipping, and finish handling.': [
        '面团塑形、炉面放置、鼓泡观察、翻面和收尾处理的烹饪示范。',
        '반죽 성형, 그리들 배치, 기포 관찰, 뒤집기, 마무리 처리를 보여주는 조리 시연.',
    ],
    'Structured sessions': ['结构化会话', '구조화된 세션'],
    'Metadata-ready handoff': ['可直接交付元数据', '메타데이터 준비 완료'],
    'Reviewed to spec': ['按规格审核', '사양 기준 검수'],
    'Share': ['分享', '공유'],
    'YouTube': ['YouTube', 'YouTube'],
    'Duration': ['时长', '길이'],
    'Trajectories': ['轨迹', '궤적'],
    'Resolution': ['分辨率', '해상도'],
    'Storage': ['存储', '스토리지'],
    'Sensor Rig': ['传感器装备', '센서 리그'],
    'Environment': ['环境', '환경'],
    'Filesystem Directory Layout': ['文件系统目录结构', '파일 시스템 디렉터리 구조'],
    'Core Annotation Modalities': ['核心标注模态', '핵심 주석 모달리티'],
    'Annotation Payload Inspector': ['标注载荷检查器', '주석 페이로드 검사기'],
    'Root Dataset Directory': ['根数据集目录', '루트 데이터셋 디렉터리'],
    'Rig parameters, human consent, environment spatial bounds': ['设备参数、人员授权、环境空间边界', '리그 파라미터, 참여자 동의, 환경 공간 경계'],
    'Intrinsics, extrinsics, distortion coefficients, baseline (65mm)': ['内参、外参、畸变系数、基线距离 (65mm)', '내부/외부 파라미터, 왜곡 계수, 베이스라인 (65mm)'],
    'Uncompressed 3840x2160 egocentric stereo video': ['未压缩 3840x2160 第一视角立体视频', '비압축 3840x2160 1인칭 스테레오 비디오'],
    'Pre-rendered 3D MANO skeleton & 6DoF bounding box verification': ['预渲染 3D MANO 骨架与 6DoF 边界框验证', '사전 렌더링된 3D MANO 스켈레톤 및 6DoF 바운딩 박스 검증'],
    'Atomic timestamps, task phase boundaries & bimanual language': ['原子级时间戳、任务阶段边界与双手动作描述', '원자 단위 타임스탬프, 작업 단계 경계, 양손 동작 언어'],
    '21 3D joint Cartesian coordinates (x,y,z) @ 60Hz per hand': ['每只手 21 个 3D 关节笛卡尔坐标 (x,y,z)，60Hz', '손별 21개 3D 관절 직교 좌표 (x,y,z) @ 60Hz'],
    '6DoF head pose quaternions, rotational velocity and translation': ['6DoF 头部姿态四元数、旋转速度和平移', '6DoF 머리 자세 쿼터니언, 회전 속도, 이동'],
    'Per-frame metric millimeter depth aligned to primary RGB optical axis': ['逐帧毫米级深度，与主 RGB 光轴对齐', '기본 RGB 광축에 정렬된 프레임별 밀리미터 단위 깊이'],
    'Dual-wrist 6-axis linear acceleration & angular rate data (<0.8ms jitter)': ['双腕 6 轴线性加速度与角速度数据（<0.8ms 抖动）', '양손목 6축 선형 가속도 및 각속도 데이터 (<0.8ms 지터)'],
    'Status': ['状态', '상태'],
    'License': ['许可', '라이선스'],
    'Activity Label': ['活动标签', '활동 라벨'],
    'Annotation Fields': ['标注字段', '주석 필드'],
    'Key Sensors': ['关键传感器', '주요 센서'],
    'Benchmark Verified': ['基准验证通过', '벤치마크 검증 완료'],
    'Commercial DaaS': ['商业 DaaS', '상업용 DaaS'],
    'Modality 01 • Temporal': ['模态 01 • 时间', '모달리티 01 • 시간'],
    'Modality 02 • Kinematics': ['模态 02 • 运动学', '모달리티 02 • 운동학'],
    'Modality 03 • Spatial 6DoF': ['模态 03 • 空间 6DoF', '모달리티 03 • 공간 6DoF'],
    'Modality 04 • Multi-Sensor': ['模态 04 • 多传感器', '모달리티 04 • 멀티 센서'],
    'Action Segmentation & Language Descriptions': ['动作分割与语言描述', '행동 분할 및 언어 설명'],
    '3D Bimanual Hand Pose (MANO 21-Joints)': ['3D 双手姿态（MANO 21 关节）', '3D 양손 자세 (MANO 21 관절)'],
    '6DoF Object Trajectories & Deformable Mesh': ['6DoF 物体轨迹与可变形网格', '6DoF 객체 궤적 및 변형 가능한 메시'],
    'Hardware Sub-Millisecond Sensor Sync': ['硬件级亚毫秒传感器同步', '하드웨어 서브밀리초 센서 동기화'],
    'Hierarchical task decomposition dividing every human episode into atomic sub-goals accompanied by dual-hand instructional text.': [
        '将每段人类示范分解为原子级子目标，并附带双手动作说明文本。',
        '모든 인간 에피소드를 원자 단위 하위 목표로 분해하고 양손 지시 텍스트를 함께 제공합니다.',
    ],
    'Hardware-timestamped start & end nanoseconds': ['硬件时间戳记录起止纳秒', '하드웨어 타임스탬프 기반 시작/종료 나노초'],
    'Sub-millimeter 3D joint coordinates for all 21 joints per hand, wrist 6DoF rotation matrices, fingertip touch contact classification, and estimated tactile grip pressure.': [
        '每只手 21 个关节的亚毫米级 3D 坐标、手腕 6DoF 旋转矩阵、指尖接触分类和触觉抓握压力估计。',
        '손별 21개 관절의 서브밀리미터 3D 좌표, 손목 6DoF 회전 행렬, 손끝 접촉 분류, 추정 촉각 그립 압력입니다.',
    ],
    '60Hz continuous trajectory with camera-frame coordinates': ['60Hz 连续轨迹，使用相机坐标系', '카메라 프레임 좌표 기반 60Hz 연속 궤적'],
    'Rigid 6DoF oriented bounding boxes for physical tools, polygonal boundary contours for deformable non-rigid objects, and active contact affordance heatmaps.': [
        '物理工具的刚体 6DoF 定向边界框、非刚性可变形物体的多边形边界轮廓，以及主动接触可供性热力图。',
        '물리 도구의 강체 6DoF 방향 바운딩 박스, 변형 가능한 비강체 객체의 다각형 경계 윤곽, 활성 접촉 어포던스 히트맵입니다.',
    ],
    'Orientation quaternions, center mass, contact surface': ['方向四元数、质心、接触表面', '방향 쿼터니언, 질량 중심, 접촉 표면'],
    '1000Hz dual-wrist 6-axis IMU streams aligned to 4K RGB video frames with sub-millisecond precision (<0.8ms jitter), eye-gaze fixations, and metric depth.': [
        '1000Hz 双腕 6 轴 IMU 流与 4K RGB 视频帧进行亚毫秒级对齐（<0.8ms 抖动），并包含眼动注视和度量深度。',
        '1000Hz 양손목 6축 IMU 스트림을 4K RGB 비디오 프레임, 시선 고정, 미터 단위 깊이와 서브밀리초 정밀도(<0.8ms 지터)로 정렬합니다.',
    ],
    'Hardware PTP clock synchronization across all buses': ['所有总线上的硬件 PTP 时钟同步', '모든 버스의 하드웨어 PTP 클록 동기화'],
    'Session payload inspector': ['会话载荷检查器', '세션 페이로드 검사기'],
    'Sample payloads generated against the selected dataset specification.': [
        '根据所选数据集规格生成的示例载荷。',
        '선택한 데이터셋 사양에 맞춰 생성된 샘플 페이로드입니다.',
    ],
    'Copy Payload': ['复制载荷', '페이로드 복사'],
    'Python API Stream Loader': ['Python API 流式加载器', 'Python API 스트림 로더'],
    'Loader snippet for streaming normalized episodic batches.': ['用于流式加载标准化 episode 批次的代码片段。', '정규화된 에피소드 배치를 스트리밍하기 위한 로더 스니펫입니다.'],
    'Copy Python Snippet': ['复制 Python 片段', 'Python 스니펫 복사'],
    'RELATED DATASETS': ['相关数据集', '관련 데이터셋'],
    'Continue exploring captures.': ['继续探索采集案例。', '캡처를 계속 살펴보기.'],
    'Comparable task demonstrations from nearby categories and capture setups.': [
        '来自相近类别和采集配置的可比较任务示范。',
        '유사한 카테고리와 캡처 설정의 비교 가능한 작업 시연입니다.',
    ],
    'Custom collection': ['定制采集', '맞춤 수집'],
    'Scope a collection': ['规划采集项目', '수집 범위 정하기'],
    'Tell us the tasks, environments, capture setup, and delivery requirements you need. We can scope a collection program around them.': [
        '告诉我们您需要的任务、环境、采集配置和交付要求。我们可以围绕这些内容规划采集项目。',
        '필요한 작업, 환경, 캡처 설정, 납품 요구사항을 알려주세요. 그에 맞춰 수집 프로그램의 범위를 정할 수 있습니다.',
    ],
    'Copy is not available in this browser context': ['当前浏览器环境无法复制', '이 브라우저 환경에서는 복사할 수 없습니다'],
    'Python snippet copied': ['Python 片段已复制', 'Python 스니펫이 복사되었습니다'],
    'Your next breakthrough.': ['您的下一次突破。', '다음 돌파구.'],
    'Starts in the real world.': ['从真实世界开始。', '현실 세계에서 시작됩니다.'],
    'START A COLLECTION': ['开始采集', '수집 시작'],
    'What does your robot': ['您的机器人', '로봇은 무엇을'],
    'need to learn?': ['需要学习什么？', '배워야 하나요?'],
    'Full Name': ['姓名', '성명'],
    'Company': ['公司', '회사'],
    'Work Email': ['工作邮箱', '업무 이메일'],
    'Country': ['国家/地区', '국가/지역'],
    'Tasks, environments, and data requirements': ['任务、环境和数据需求', '작업, 환경, 데이터 요구사항'],
    'Select a country': ['选择国家/地区', '국가/지역 선택'],
    'Search countries...': ['搜索国家/地区...', '국가/지역 검색...'],
    'Search countries': ['搜索国家/地区', '국가/지역 검색'],
    'No countries found.': ['未找到国家/地区。', '국가/지역을 찾을 수 없습니다.'],
    'Please complete all required fields, including your country.': ['请填写所有必填字段，包括国家/地区。', '국가/지역을 포함해 모든 필수 항목을 입력해 주세요.'],
    'The request could not be submitted. Please try again.': ['请求未能提交。请重试。', '요청을 제출할 수 없습니다. 다시 시도해 주세요.'],
    'Your collection request was sent. We will follow up using the email address provided.': [
        '您的采集请求已发送。我们会通过您提供的邮箱继续联系。',
        '수집 요청이 전송되었습니다. 제공하신 이메일 주소로 후속 연락을 드리겠습니다.',
    ],
    'Request sent': ['请求已发送', '요청 전송 완료'],
    'Submit another brief': ['提交另一份需求', '다른 브리프 제출'],
    'Describe the tasks, environments, capture setup, session rules, and delivery requirements...': [
        '描述任务、环境、采集配置、会话规则和交付要求...',
        '작업, 환경, 캡처 설정, 세션 규칙, 납품 요구사항을 설명해 주세요...',
    ],
    'Sending request...': ['正在发送请求...', '요청을 보내는 중...'],
    'Request data ↗': ['申请数据 ↗', '데이터 요청 ↗'],
    'SCROLL INTO THE CONNECTION ↓': ['继续滚动进入连接 ↓', '연결 지점까지 스크롤 ↓'],
    'Wireframe human and robot hands reaching toward each other': ['线框风格的人手与机器人手彼此靠近', '서로를 향해 뻗는 와이어프레임 인간 손과 로봇 손'],
    'Loading data visualization': ['正在加载数据可视化', '데이터 시각화 로딩 중'],
    'Loading featured datasets': ['正在加载精选数据集', '주요 데이터셋 로딩 중'],
    'Close dataset details': ['关闭数据集详情', '데이터셋 상세 닫기'],
    'Copy dataset link': ['复制数据集链接', '데이터셋 링크 복사'],
    'Dataset delivery properties': ['数据集交付属性', '데이터셋 납품 속성'],
    'Dataset details': ['数据集详情', '데이터셋 상세'],
    'REAL DEMONSTRATION STREAM': ['真实示范视频流', '실제 시연 스트림'],
    'Stream Code:': ['视频流代码：', '스트림 코드:'],
    'CV Overlays': ['CV 叠加层', 'CV 오버레이'],
    'MICROTASK TIMELINES': ['微任务时间线', '마이크로태스크 타임라인'],
    'Microtasks': ['微任务', '마이크로태스크'],
    'Microtask': ['微任务', '마이크로태스크'],
    'PHASE:': ['阶段：', '단계:'],
    'Operators': ['操作员', '작업자'],
    'demos': ['示范', '시연'],
    'Available': ['可用', '사용 가능'],
    'COLLECTION NETWORK': ['采集网络', '수집 네트워크'],
    'VIDEO': ['视频', '비디오'],
    'QC + STRUCTURE': ['质检 + 结构化', 'QC + 구조화'],
    'TRAINING DATA': ['训练数据', '학습 데이터'],
    'Culinary egocentric capture of traditional artisan naan bread preparation: fermented dough pad stretching and palm slapping, placement onto hot griddle surface, blister bubble growth monitoring, and high-heat spatula flip.': [
        '传统手工馕饼制作的烹饪第一视角采集：发酵面团垫拉伸与掌拍、放置到高温煎盘表面、监测鼓泡生长，以及高温铲翻。',
        '전통 장인 난 빵 준비의 조리 1인칭 캡처: 발효 반죽 패드 늘리기와 손바닥 치기, 뜨거운 그리들 표면 배치, 기포 성장 관찰, 고열 주걱 뒤집기.',
    ],
    'Real Demonstration Stream': ['真实示范视频流', '실제 시연 스트림'],
    'CV Overlays: ON': ['CV 叠加层：开', 'CV 오버레이: 켬'],
    'Toggle Computer Vision 3D Hand Skeleton & 6DoF Mesh Overlays': [
        '切换计算机视觉 3D 手部骨架与 6DoF 网格叠加层',
        '컴퓨터 비전 3D 손 스켈레톤 및 6DoF 메시 오버레이 전환',
    ],
    'Fullscreen Player': ['全屏播放器', '전체 화면 플레이어'],
    'First-Person Stream Preview': ['第一视角视频流预览', '1인칭 스트림 미리보기'],
    'Pause video': ['暂停视频', '동영상 일시정지'],
    'Play video': ['播放视频', '동영상 재생'],
    'Resume video': ['继续播放视频', '동영상 다시 재생'],
    'Pause': ['暂停', '일시정지'],
    'Play': ['播放', '재생'],
    'Seek video position': ['调整视频位置', '동영상 위치 이동'],
    'Unmute': ['取消静音', '음소거 해제'],
    'Mute': ['静音', '음소거'],
    'MANO 3D POSE: SYNCHRONIZED': ['MANO 3D 姿态：已同步', 'MANO 3D 포즈: 동기화됨'],
    'Raw Fabric Intake & Clamp Alignment': ['原始布料放入与夹具对齐', '원단 투입 및 클램프 정렬'],
    'Positioning raw cloth cutouts under presser foot and aligning guide margins.': ['将裁片放到压脚下并对齐导向边距。', '재단 원단을 노루발 아래에 놓고 가이드 여백을 정렬합니다.'],
    'Fabric Prep': ['布料准备', '원단 준비'],
    'Presser Foot Lowering & Needle Centering': ['压脚下压与针位居中', '노루발 내림 및 바늘 중심 맞춤'],
    'Lowering presser foot bar and testing needle puncture clearance on seam allowance.': ['放下压脚杆，并在缝份上测试针刺间隙。', '노루발 바를 내리고 솔기 여유분에서 바늘 관통 간격을 확인합니다.'],
    'Tool Engagement': ['工具接合', '도구 결합'],
    'Initial Lockstitch & Bimanual Seam Feeding': ['初始锁式线迹与双手送缝', '초기 락스티치 및 양손 솔기 이송'],
    'Engaging foot pedal, setting first 4 anchoring stitches, and establishing bimanual feed rate.': ['踩下脚踏，完成前 4 个固定针脚，并建立双手送布节奏。', '풋 페달을 밟아 첫 4개의 고정 스티치를 만들고 양손 이송 속도를 맞춥니다.'],
    'Continuous Stitching': ['连续缝制', '연속 박음질'],
    'Tension Regulated Straight Line Feed': ['张力调节直线送布', '장력 조절 직선 이송'],
    'Guiding fabric panel with steady left-hand lateral pull against mechanical needle oscillations.': ['左手稳定侧向拉拽布片，对抗机械针上下运动并引导缝线。', '왼손으로 원단을 일정하게 옆으로 당기며 바늘 진동에 맞춰 패널을 안내합니다.'],
    'Seam Guidance': ['缝线引导', '솔기 가이드'],
    'Curved Margin Tracking & Hand Reorientation': ['曲线边距跟踪与手部重定位', '곡선 여백 추적 및 손 재배치'],
    'Pivoting cloth orientation around curved garment contour with micro finger repositioning.': ['围绕服装曲线轮廓旋转布料方向，并进行细微手指重定位。', '곡선 의류 윤곽을 따라 원단 방향을 돌리며 손가락을 세밀하게 재배치합니다.'],
    'Angular Contour': ['角度轮廓', '각도 윤곽'],
    'Reverse Stitch Reinforcement': ['倒缝加固', '역방향 스티치 보강'],
    'Depressing reverse lever to backstitch 3 cycles, locking seam end securely.': ['按下倒缝杆进行 3 次回缝，牢固锁住缝线末端。', '역방향 레버를 눌러 3회 백스티치하고 솔기 끝을 단단히 고정합니다.'],
    'Seam Lock': ['缝线锁定', '솔기 고정'],
    'Presser Foot Lift, Snip & QC Inspection': ['抬压脚、剪线与质检', '노루발 올림, 실 자르기 및 QC 검사'],
    'Lifting presser foot, pulling finished hem clear, snipping thread tails, and inspecting stitch pitch.': ['抬起压脚，拉出完成的下摆，剪去线头，并检查针距。', '노루발을 올리고 완성된 밑단을 빼낸 뒤 실 끝을 자르고 스티치 간격을 검사합니다.'],
    'Completion & QC': ['完成与质检', '완료 및 QC'],
    'Canvas Tote Loading & Registration Alignment': ['帆布托特包装载与套准对齐', '캔버스 토트백 장착 및 위치 정렬'],
    'Slipping tote bag over wooden platen, aligning seams, and centering print boundary.': ['将托特包套到木质印台上，对齐缝线并居中印刷边界。', '토트백을 목재 플래튼에 씌우고 솔기를 맞춘 뒤 인쇄 경계를 중앙에 둡니다.'],
    'Platen Setup': ['印台设置', '플래튼 설정'],
    'Surface Wrinkle Smoothing & Platen Tack': ['表面皱褶抚平与印台粘附', '표면 주름 제거 및 플래튼 점착'],
    'Pressing fabric flat against water-based adhesive platen to remove fabric bubbles.': ['将布料压平到水性胶印台上，去除布面气泡。', '수성 접착 플래튼에 원단을 눌러 기포를 제거합니다.'],
    'Substrate Prep': ['承印物准备', '기재 준비'],
    'Stencil Screen Hinge Lowering & Clamp': ['模板网版下放与夹紧', '스텐실 스크린 힌지 내림 및 클램프'],
    'Swinging silk screen down, verifying off-contact gap spacing, and locking side clamps.': ['放下丝网版，确认离版间隙，并锁紧侧夹。', '실크스크린을 내리고 오프컨택 간격을 확인한 뒤 측면 클램프를 잠급니다.'],
    'Screen Positioning': ['网版定位', '스크린 위치 지정'],
    'Plastisol Ink Deposit & Flood Stroke': ['塑溶油墨上墨与铺墨', '플라스티졸 잉크 투입 및 플러드 스트로크'],
    'Scooping ink bead across top reservoir and executing light forward flood coat.': ['将油墨刮到上方墨槽，并轻推完成铺墨。', '상단 저장부에 잉크를 떠 올리고 가볍게 앞으로 플러드 코팅합니다.'],
    'Ink Flooding': ['铺墨', '잉크 플러딩'],
    'Pressurized 45° Squeegee Draw Transfer': ['45° 加压刮刀拉印转印', '45도 압력 스퀴지 드로우 전사'],
    'Firm bimanual downward pressure at 45-degree angle, forcing ink through stencil mesh.': ['以 45 度角双手稳定下压，迫使油墨穿过模板网孔。', '45도 각도로 양손 압력을 강하게 가해 잉크를 스텐실 망으로 통과시킵니다.'],
    'Pressure Transfer': ['压力转印', '압력 전사'],
    'Screen Delamination & Vertical Hinge Lift': ['网版剥离与垂直抬起', '스크린 박리 및 수직 힌지 리프트'],
    'Slow vertical peel of screen frame to prevent ink smudging and feathering.': ['缓慢垂直剥离网框，避免油墨拖影和边缘晕散。', '잉크 번짐과 가장자리 퍼짐을 방지하기 위해 스크린 프레임을 천천히 수직으로 들어 올립니다.'],
    'Screen Lift': ['网版抬起', '스크린 리프트'],
    'Print Opacity Inspection & Unload': ['印刷遮盖度检查与卸载', '인쇄 불투명도 검사 및 언로드'],
    'Evaluating edge crispness under inspection lamp and peeling finished bag off platen.': ['在检查灯下评估边缘清晰度，并将完成的包从印台上取下。', '검사등 아래에서 가장자리 선명도를 평가하고 완성된 가방을 플래튼에서 떼어냅니다.'],
    'Unload & QC': ['卸载与质检', '언로드 및 QC'],
    'Espresso Shot Crema Inspection & Cup Grip': ['浓缩咖啡油脂检查与持杯', '에스프레소 크레마 검사 및 컵 그립'],
    'Inspecting crema elasticity and grasping ceramic cup with 35-degree wrist tilt.': ['检查咖啡油脂弹性，并以 35 度手腕倾角握住陶瓷杯。', '크레마 탄성을 검사하고 손목을 35도 기울여 세라믹 컵을 잡습니다.'],
    'Base Angle Setup': ['基底角度设置', '베이스 각도 설정'],
    'Steamed Milk Swirl & Glossy Vortex Aeration': ['蒸奶旋杯与光泽涡流融合', '스팀 밀크 스월 및 광택 보텍스 에어레이션'],
    'Tapping pitcher base against counter and swirling to homogenize liquid-to-foam ratio.': ['轻敲拉花缸底部并旋转，使液体与奶泡比例均匀。', '피처 바닥을 카운터에 두드리고 돌려 액체와 거품 비율을 균질화합니다.'],
    'Aeration Prep': ['融合准备', '에어레이션 준비'],
    'High-Elevation Pour for Crema Depth Blend': ['高位注入融合咖啡油脂层', '크레마 깊이 블렌딩을 위한 높은 위치 붓기'],
    'Pencil-thin milk stream from 8cm elevation diving under surface without marking crema.': ['从 8cm 高处注入铅笔般细的奶流，使其潜入表面下方且不破坏油脂层。', '8cm 높이에서 연필처럼 얇은 우유 줄기를 내려 크레마 표면을 표시하지 않고 아래로 흐르게 합니다.'],
    'Liquid Integration': ['液体融合', '액체 통합'],
    'Pitcher Spout Drop to Liquid Surface': ['拉花缸嘴贴近液面', '피처 스파웃을 액체 표면으로 낮춤'],
    'Dropping pitcher tip to 5mm above surface while leveling cup angle horizontally.': ['将缸嘴降至液面上方 5mm，同时将杯身角度调平。', '피처 끝을 표면 위 5mm까지 낮추며 컵 각도를 수평으로 맞춥니다.'],
    'Surface Approach': ['贴近表面', '표면 접근'],
    'Rapid Wrist Oscillation & Rosetta Wave Spread': ['快速手腕摆动与玫瑰纹扩散', '빠른 손목 진동 및 로제타 물결 확산'],
    'Executing high-frequency side-to-side wrist wiggles to float white foam ribbons.': ['执行高频左右手腕摆动，让白色奶泡纹带浮起。', '좌우 고주파 손목 움직임으로 흰 거품 리본을 띄웁니다.'],
    'Rosetta Pour': ['玫瑰纹倒花', '로제타 붓기'],
    'Stream Thinning & Forward Draw-Through Cut': ['细流收束与前向穿纹', '줄기 얇게 만들기 및 전방 드로스루'],
    'Elevating pitcher spout and cutting forward through pattern center to form stem symmetry.': ['抬高缸嘴并向前穿过图案中心，形成对称茎线。', '피처 스파웃을 들어 올리고 패턴 중앙을 앞으로 가르며 줄기 대칭을 만듭니다.'],
    'Draw-Through & Finish': ['穿纹与收尾', '드로스루 및 마감'],
    'Garment Unfold & Ironing Board Spread': ['衣物展开与熨衣板铺放', '의류 펼침 및 다림판 배치'],
    'Laying shirt panel flat across ironing board, smoothing out large folds, and grasping hem edge.': ['将衬衫衣片平铺在熨衣板上，抚平大褶皱并抓住下摆边缘。', '셔츠 패널을 다림판 위에 평평하게 놓고 큰 주름을 펴며 밑단 가장자리를 잡습니다.'],
    'Board Staging': ['熨板布置', '보드 준비'],
    'Left-Hand Fabric Tension Stretch & Collar Flattening': ['左手布料张力拉伸与领口压平', '왼손 원단 장력 스트레치 및 칼라 펴기'],
    'Tensioning seam with left hand while flattening collar points along board contour.': ['左手拉紧缝线，同时沿熨板轮廓压平领尖。', '왼손으로 솔기에 장력을 주면서 보드 윤곽을 따라 칼라 끝을 펴냅니다.'],
    'Pre-Tensioning': ['预张紧', '사전 장력'],
    'High-Pressure Steam Burst & Forward Soleplate Glide': ['高压蒸汽喷发与底板前向滑动', '고압 스팀 분사 및 열판 전방 글라이드'],
    'Triggering burst steam valve while executing long forward glide along torso panel.': ['触发强蒸汽阀，同时沿衣身面板执行长距离前向滑动。', '강한 스팀 밸브를 작동하며 몸통 패널을 따라 길게 앞으로 미끄러집니다.'],
    'Body Pressing': ['衣身熨压', '몸판 다림'],
    'Shoulder Yoke Alignment & Contour Ironing': ['肩育克对齐与轮廓熨烫', '어깨 요크 정렬 및 윤곽 다림'],
    'Sliding rounded shoulder seam over narrow board tip and pressing curved seams.': ['将圆弧肩缝滑过窄板尖端，并压烫曲线缝线。', '둥근 어깨 솔기를 좁은 보드 끝 위로 밀어 곡선 솔기를 눌러 다립니다.'],
    'Shoulder Contour': ['肩部轮廓', '어깨 윤곽'],
    'Sleeve Crease Guidance & Cuff Detailing': ['袖褶引导与袖口细节处理', '소매 주름 가이드 및 커프 디테일'],
    'Forming crisp lateral crease line along sleeve edge and pressing around button cuff.': ['沿袖边形成清晰横向折线，并围绕纽扣袖口熨压。', '소매 가장자리를 따라 또렷한 측면 주름선을 만들고 단추 커프 주변을 다립니다.'],
    'Sleeve Finishing': ['袖部收尾', '소매 마감'],
    'Button Placket Precision Narrow Tip Maneuver': ['纽扣门襟窄尖精细操作', '버튼 플래킷 정밀 좁은 팁 조작'],
    'Navigating soleplate pointed apex between individual buttons without thermal contact.': ['让熨斗底板尖端在纽扣之间穿行，避免热接触。', '열 접촉 없이 열판의 뾰족한 끝을 개별 단추 사이로 움직입니다.'],
    'Placket Detail': ['门襟细节', '플래킷 디테일'],
    'Final Garment Reposition & Crease Check': ['最终衣物复位与折痕检查', '최종 의류 재배치 및 주름 검사'],
    'Lifting shirt onto hanger, smoothing collar roll, and inspecting wrinkle elimination.': ['将衬衫挂到衣架上，抚平领卷，并检查皱褶消除效果。', '셔츠를 옷걸이에 걸고 칼라 롤을 정리한 뒤 주름 제거 상태를 검사합니다.'],
    'Two-Handed Trimmer Stance & Ground Clearance': ['双手打草机站姿与离地间隙', '양손 트리머 자세 및 지면 간격'],
    'Establishing athletic stance, checking line feed length, and holding head 5cm above turf.': ['建立稳定站姿，检查线绳伸出长度，并让机头保持在草面上方 5cm。', '안정적인 자세를 잡고 라인 피드 길이를 확인하며 헤드를 잔디 위 5cm에 유지합니다.'],
    'Stance Calibration': ['站姿校准', '자세 보정'],
    'Throttle Trigger Engagement & RPM Stabilization': ['油门触发与转速稳定', '스로틀 트리거 작동 및 RPM 안정화'],
    'Squeezing throttle trigger to bring trimmer spool to optimal cutting speed.': ['按下油门扳机，让打草机线盘达到最佳切割速度。', '스로틀 트리거를 당겨 트리머 스풀이 최적 절단 속도에 도달하게 합니다.'],
    'Motor Spin-Up': ['电机升速', '모터 스핀업'],
    'Wide Horizontal Sweeping Arc Across Turf': ['草坪宽幅水平扫掠弧线', '잔디 위 넓은 수평 스위핑 아크'],
    'Executing smooth pendular left-to-right cutting pass leveling overgrown turf.': ['执行平滑的左右摆动切割路径，修平过长草面。', '부드러운 좌우 진자형 절단 패스로 자란 잔디를 평탄화합니다.'],
    'Primary Lawn Sweep': ['主要草坪扫掠', '주요 잔디 스윕'],
    'Obstacle Perimeter Weeding & Fence Boundary Clean': ['障碍物周边除草与围栏边界清理', '장애물 주변 제초 및 울타리 경계 정리'],
    'Trimming close around wooden fence posts and landscaping rock boundaries.': ['贴近木质围栏柱和景观石边界进行修剪。', '목재 울타리 기둥과 조경석 경계 주변을 가까이 다듬습니다.'],
    'Obstacle Trimming': ['障碍物修剪', '장애물 트리밍'],
    '90° Shaft Tilt for Vertical Sidewalk Edging': ['90° 杆身倾斜做人行道垂直修边', '수직 보도 경계 작업을 위한 90도 샤프트 기울임'],
    'Inverting shaft 90 degrees to cut sharp trench boundary along concrete pathway.': ['将杆身翻转 90 度，沿混凝土步道切出清晰沟边。', '샤프트를 90도 뒤집어 콘크리트 길을 따라 선명한 홈 경계를 자릅니다.'],
    'Curb Edging': ['路缘修边', '연석 경계 다듬기'],
    'Grass Clump Dispersal & High-Speed Pass': ['草屑团分散与高速扫过', '잔디 뭉침 분산 및 고속 패스'],
    'Quick sweeping bursts to clear cut mulch from walkway surface.': ['快速扫掠，清除步道表面的碎草覆盖物。', '빠른 스위핑으로 보도 표면의 잘린 잔디 잔여물을 치웁니다.'],
    'Surface Leveling': ['表面找平', '표면 평탄화'],
    'Throttle Release, Brake & Boundary Check': ['松开油门、制动与边界检查', '스로틀 해제, 제동 및 경계 확인'],
    'Releasing throttle trigger, setting down tool, and verifying crisp lawn edge.': ['松开油门扳机，放下工具，并确认草坪边缘清晰。', '스로틀 트리거를 놓고 도구를 내려놓은 뒤 잔디 경계가 깔끔한지 확인합니다.'],
    'Shutdown & QC': ['停机与质检', '종료 및 QC'],
    'Dough Ball De-Gassing & Palm Flattening': ['面团排气与掌压展平', '반죽 볼 가스 제거 및 손바닥 평탄화'],
    'Gentle finger press into fermented dough ball and spreading into round disc.': ['用手指轻压发酵面团排气，并摊成圆盘。', '발효 반죽 볼을 손가락으로 부드럽게 눌러 둥근 원반으로 펼칩니다.'],
    'Dough Intake': ['面团处理', '반죽 투입'],
    'Bimanual Palm Slap Aeration & Stretch': ['双手掌拍充气与拉伸', '양손 손바닥 치기 에어레이션 및 늘리기'],
    'Rapid rhythmic slapping of dough between palms, stretching into classic teardrop shape.': ['双掌之间快速有节奏地拍打面团，将其拉伸成经典水滴形。', '양손 사이에서 반죽을 빠르게 리듬감 있게 치며 전형적인 물방울 모양으로 늘립니다.'],
    'Slap & Stretch': ['拍打与拉伸', '치기 및 늘리기'],
    'Water Mist Application to Under-Surface': ['底面刷水雾', '아랫면 물막 적용'],
    'Brushing thin water film onto bottom surface to enable contact adhesion to hot pan.': ['在底面刷上一层薄水膜，使其能粘附到热锅表面。', '뜨거운 팬에 붙도록 바닥면에 얇은 물막을 바릅니다.'],
    'Adhesion Prep': ['粘附准备', '접착 준비'],
    'High-Heat Griddle Adhesion & Steam Pockets': ['高温煎盘贴附与蒸汽气囊', '고열 그리들 접착 및 증기 포켓'],
    'Slapping dough onto heated cast iron griddle, observing rapid steam bubble inflation.': ['将面团拍到加热铸铁煎盘上，观察蒸汽气泡快速鼓起。', '가열된 주철 그리들에 반죽을 붙이고 빠른 증기 기포 팽창을 관찰합니다.'],
    'Griddle Contact': ['煎盘接触', '그리들 접촉'],
    'Blister Growth Monitoring & Spatula Edge Lift': ['鼓泡生长监测与铲边抬起', '기포 성장 모니터링 및 주걱 가장자리 들어올림'],
    'Testing underside adhesion with metal spatula and verifying uniform char spots.': ['用金属铲测试底面粘附，并确认焦斑均匀。', '금속 주걱으로 아랫면 접착을 테스트하고 균일한 그을림 반점을 확인합니다.'],
    'Blistering': ['鼓泡', '기포 형성'],
    'Rapid 180° Inversion & Flame Toasting': ['快速 180° 翻转与明火烘烤', '빠른 180도 뒤집기 및 불꽃 토스팅'],
    'Inverting pan or using tongs to expose top blisters directly to open heat flame.': ['翻转平底锅或使用夹子，让顶部鼓泡直接接触明火高温。', '팬을 뒤집거나 집게를 사용해 위쪽 기포를 직접 화염에 노출합니다.'],
    'Charring & Flip': ['焦化与翻面', '그을림 및 뒤집기'],
    'Ghee Brushing, Plating & Hearth Removal': ['刷酥油、装盘与离炉', '기 버터 바르기, 플레이팅 및 화덕 제거'],
    'Brushing glistening melted ghee across toasted blister mounds and transferring to serving cloth.': ['在烤好的鼓泡表面刷上亮泽融化酥油，并转移到上桌布上。', '구워진 기포 위에 윤기 나는 녹인 기 버터를 바르고 서빙 천으로 옮깁니다.'],
    'Finishing': ['收尾', '마무리'],
};

const domainNames = [
    ['Office Administration', '办公室行政', '사무 행정'],
    ['Healthcare & Pharmacy', '医疗与药房', '의료 및 약국'],
    ['Hospitality', '酒店与接待服务', '접객 서비스'],
    ['Beauty & Grooming', '美容护理', '미용 및 관리'],
    ['Education & Childcare', '教育与托育', '교육 및 보육'],
    ['Assisted Living', '生活辅助', '생활 지원'],
    ['Food Processing', '食品加工', '식품 가공'],
    ['Food & Beverage', '餐饮', '식음료'],
    ['Cleaning & Sanitation', '清洁与卫生', '청소 및 위생'],
    ['Pet & Animal Care', '宠物与动物护理', '반려동물 및 동물 돌봄'],
    ['Laundry & Textile Care', '洗衣与织物护理', '세탁 및 섬유 관리'],
    ['Home Organization', '家居整理', '집 정리'],
    ['Manufacturing', '制造业', '제조'],
    ['Construction', '建筑施工', '건설'],
    ['Automotive', '汽车', '자동차'],
    ['Repair & Maintenance', '维修与维护', '수리 및 유지보수'],
    ['Warehouse Operations', '仓储运营', '창고 운영'],
    ['Quality Inspection', '质量检验', '품질 검사'],
    ['Agriculture & Farming', '农业与农场作业', '농업 및 농장 작업'],
    ['Agriculture & Livestock', '农业与畜牧', '농업 및 축산'],
    ['Landscaping & Gardening', '园林与园艺', '조경 및 원예'],
    ['Utilities & Infrastructure', '公用事业与基础设施', '공공시설 및 인프라'],
    ['Waste & Recycling', '废弃物与回收', '폐기물 및 재활용'],
    ['Field Maintenance', '现场维护', '현장 유지보수'],
    ['Environmental Services', '环境服务', '환경 서비스'],
    ['Pick & Place', '抓取与放置', '집기 및 놓기'],
    ['Assembly & Disassembly', '组装与拆卸', '조립 및 분해'],
    ['Tool Use', '工具使用', '도구 사용'],
    ['Sorting & Packing', '分拣与包装', '분류 및 포장'],
    ['Folding & Textile Work', '折叠与纺织作业', '접기 및 섬유 작업'],
    ['Insertion & Fastening', '插入与紧固', '삽입 및 체결'],
    ['Laboratory', '实验室', '실험실'],
    ['Retail & Logistics', '零售与物流', '소매 및 물류'],
    ['Creative Crafts', '创意工艺', '창작 공예'],
    ['Electronics & Hardware', '电子与硬件', '전자 및 하드웨어'],
    ['Commercial Kitchens', '商用厨房', '상업용 주방'],
    ['Facility Operations', '设施运营', '시설 운영'],
    ['Argentina', '阿根廷', '아르헨티나'],
    ['Australia', '澳大利亚', '호주'],
    ['Austria', '奥地利', '오스트리아'],
    ['Bangladesh', '孟加拉国', '방글라데시'],
    ['Belgium', '比利时', '벨기에'],
    ['Brazil', '巴西', '브라질'],
    ['Canada', '加拿大', '캐나다'],
    ['Chile', '智利', '칠레'],
    ['China', '中国', '중국'],
    ['Colombia', '哥伦比亚', '콜롬비아'],
    ['Czech Republic', '捷克共和国', '체코'],
    ['Denmark', '丹麦', '덴마크'],
    ['Egypt', '埃及', '이집트'],
    ['Finland', '芬兰', '핀란드'],
    ['France', '法国', '프랑스'],
    ['Germany', '德国', '독일'],
    ['Greece', '希腊', '그리스'],
    ['Hong Kong', '中国香港', '홍콩'],
    ['India', '印度', '인도'],
    ['Indonesia', '印度尼西亚', '인도네시아'],
    ['Ireland', '爱尔兰', '아일랜드'],
    ['Israel', '以色列', '이스라엘'],
    ['Italy', '意大利', '이탈리아'],
    ['Japan', '日本', '일본'],
    ['Kenya', '肯尼亚', '케냐'],
    ['Malaysia', '马来西亚', '말레이시아'],
    ['Mexico', '墨西哥', '멕시코'],
    ['Netherlands', '荷兰', '네덜란드'],
    ['New Zealand', '新西兰', '뉴질랜드'],
    ['Nigeria', '尼日利亚', '나이지리아'],
    ['Norway', '挪威', '노르웨이'],
    ['Pakistan', '巴基斯坦', '파키스탄'],
    ['Philippines', '菲律宾', '필리핀'],
    ['Poland', '波兰', '폴란드'],
    ['Portugal', '葡萄牙', '포르투갈'],
    ['Singapore', '新加坡', '싱가포르'],
    ['South Africa', '南非', '남아프리카공화국'],
    ['South Korea', '韩国', '대한민국'],
    ['Spain', '西班牙', '스페인'],
    ['Sweden', '瑞典', '스웨덴'],
    ['Switzerland', '瑞士', '스위스'],
    ['Taiwan', '中国台湾', '대만'],
    ['Thailand', '泰国', '태국'],
    ['Turkey', '土耳其', '튀르키예'],
    ['United Arab Emirates', '阿拉伯联合酋长国', '아랍에미리트'],
    ['United Kingdom', '英国', '영국'],
    ['United States', '美国', '미국'],
    ['Vietnam', '越南', '베트남'],
] as const;

domainNames.forEach(([en, zh, ko]) => {
    translations[en] = [zh, ko];
});

function normalizeLanguage(value: string | null | undefined): Language {
    if (value === 'zh' || value === 'ko' || value === 'en') return value;
    return 'en';
}

function readLanguageFromUrl(): Language {
  if (typeof window === 'undefined') return 'en';
  const pathLanguage = window.location.pathname.split('/').filter(Boolean)[0];
  if (pathLanguage === 'cn' || pathLanguage === 'zh') return 'zh';
  if (pathLanguage === 'en' || pathLanguage === 'ko') return pathLanguage;
  return normalizeLanguage(new URLSearchParams(window.location.search).get('lang'));
}

function languageHref(language: Language) {
    const path = languagePaths[language];
    if (typeof window === 'undefined') return path;

    const url = new URL(window.location.href);
    url.pathname = path;
    url.searchParams.delete('lang');
    return `${url.pathname}${url.search}${url.hash}`;
}

function writeLanguageToUrl(language: Language) {
    const next = languageHref(language);
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== next) {
        window.history.pushState({ language }, '', next);
    }
}

function setMetaContent(selector: string, content: string) {
    document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

function updateDocumentMeta(language: Language) {
    const meta = languageMeta[language];
    const currentPath = window.location.pathname === '/' && language === 'en' ? '/' : languagePaths[language];
    const currentUrl = `${productionOrigin}${currentPath}`;
    document.documentElement.lang = meta.htmlLang;
    document.documentElement.dataset.language = language;
    document.title = meta.title;

    setMetaContent('meta[name="description"]', meta.description);
    setMetaContent('meta[property="og:title"]', meta.ogTitle);
    setMetaContent('meta[property="og:description"]', meta.ogDescription);
    setMetaContent('meta[property="og:locale"]', meta.locale);
    setMetaContent('meta[property="og:url"]', currentUrl);
    setMetaContent('meta[name="twitter:title"]', meta.ogTitle);
    setMetaContent('meta[name="twitter:description"]', meta.description);
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', currentUrl);

    const jsonLdSchemas = document.head.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"][data-schema]');
    jsonLdSchemas.forEach((schemaElement) => {
        if (!schemaElement.textContent) return;
        try {
            const schema = JSON.parse(schemaElement.textContent) as Record<string, unknown>;
            schema.description = meta.description;
            if (schemaElement.dataset.schema === 'website') schema.inLanguage = meta.htmlLang;
            schemaElement.textContent = JSON.stringify(schema, null, 2);
        } catch {
            // Keep existing structured data if the browser cannot parse it.
        }
    });
}

function getTranslation(value: string, language: Exclude<Language, 'en'>): string | null {
    const direct = translations[value]?.[language === 'zh' ? 0 : 1];
    if (direct) return direct;

    const viewMatch = value.match(/^View (.+)$/);
    if (viewMatch) {
        const title: string = getTranslation(viewMatch[1], language) ?? viewMatch[1];
        return language === 'zh' ? `查看 ${title}` : `${title} 보기`;
    }

    const segmentMatch = value.match(/^(.+?) \/ (\d+) segments$/);
    if (segmentMatch) {
        const title: string = getTranslation(segmentMatch[1], language) ?? segmentMatch[1];
        return language === 'zh' ? `${title} / ${segmentMatch[2]} 个片段` : `${title} / ${segmentMatch[2]}개 세그먼트`;
    }

    const microTaskMatch = value.match(/^(\d+) Micro-tasks$/);
    if (microTaskMatch) {
        return language === 'zh' ? `${microTaskMatch[1]} 个微任务` : `${microTaskMatch[1]}개 마이크로태스크`;
    }

    const microTasksLabelMatch = value.match(/^(\d+) Microtasks$/);
    if (microTasksLabelMatch) {
        return language === 'zh' ? `${microTasksLabelMatch[1]} 个微任务` : `${microTasksLabelMatch[1]}개 마이크로태스크`;
    }

    const microTaskLabelMatch = value.match(/^Microtask (\d+)$/i);
    if (microTaskLabelMatch) {
        return language === 'zh' ? `微任务 ${microTaskLabelMatch[1]}` : `마이크로태스크 ${microTaskLabelMatch[1]}`;
    }

    const phaseMatch = value.match(/^Phase:\s*(.+)$/i);
    if (phaseMatch) {
        const phase: string = getTranslation(phaseMatch[1], language) ?? phaseMatch[1];
        return language === 'zh' ? `阶段：${phase}` : `단계: ${phase}`;
    }

    const operatorMatch = value.match(/^(\d+) Operators$/);
    if (operatorMatch) {
        return language === 'zh' ? `${operatorMatch[1]} 名操作员` : `${operatorMatch[1]}명 작업자`;
    }

    const syncedMatch = value.match(/^(\d+) Synced Streams$/);
    if (syncedMatch) {
        return language === 'zh' ? `${syncedMatch[1]} 路同步流` : `${syncedMatch[1]}개 동기화 스트림`;
    }

    const copiedMatch = value.match(/^(.+) copied$/);
    if (copiedMatch) {
        return language === 'zh' ? `${copiedMatch[1]} 已复制` : `${copiedMatch[1]} 복사됨`;
    }

    const linkCopiedMatch = value.match(/^(.+) link copied$/);
    if (linkCopiedMatch) {
        return language === 'zh' ? `${linkCopiedMatch[1]} 链接已复制` : `${linkCopiedMatch[1]} 링크 복사됨`;
    }

    const streamPreviewMatch = value.match(/^Synchronized 4K raw video capture stream for (.+)\. High-frame-rate multimodal trajectories recorded at 60 FPS\.$/);
    if (streamPreviewMatch) {
        return language === 'zh'
            ? `${streamPreviewMatch[1]} 的同步 4K 原始视频采集流。以 60 FPS 记录高帧率多模态轨迹。`
            : `${streamPreviewMatch[1]}의 동기화된 4K 원본 비디오 캡처 스트림입니다. 60 FPS로 고프레임률 멀티모달 궤적을 기록합니다.`;
    }

    const jointsMatch = value.match(/^Joints: 21 Right \/ 21 Left • Freq: 60Hz$/);
    if (jointsMatch) {
        return language === 'zh' ? '关节：右手 21 / 左手 21 • 频率：60Hz' : '관절: 오른손 21 / 왼손 21 • 주파수: 60Hz';
    }

    const segmentStatusMatch = value.match(/^Segment:\s*(.+)$/);
    if (segmentStatusMatch) {
        const phase: string = getTranslation(segmentStatusMatch[1], language) ?? segmentStatusMatch[1];
        return language === 'zh' ? `片段：${phase}` : `세그먼트: ${phase}`;
    }

    const scrollMatch = value.match(/^Scroll down to inspect all (\d+) sequential microtasks$/);
    if (scrollMatch) {
        return language === 'zh' ? `向下滚动查看全部 ${scrollMatch[1]} 个连续微任务` : `아래로 스크롤해 ${scrollMatch[1]}개의 순차 마이크로태스크를 모두 확인`;
    }

    const swipeMatch = value.match(/^Geser ke samping \(swipe\) untuk melihat seluruh (\d+) microtask →$/);
    if (swipeMatch) {
        return language === 'zh' ? `横向滑动查看全部 ${swipeMatch[1]} 个微任务 →` : `옆으로 스와이프해 ${swipeMatch[1]}개 마이크로태스크 모두 보기 →`;
    }

    const volumeMatch = value.match(/^Volume: (\d+)%$/);
    if (volumeMatch) {
        return language === 'zh' ? `音量：${volumeMatch[1]}%` : `볼륨: ${volumeMatch[1]}%`;
    }

    return null;
}

function translateValue(value: string, language: Exclude<Language, 'en'>) {
    const trimmed = value.trim();
    if (!trimmed) return value;

    let translated = getTranslation(trimmed, language);

    // If not found directly, normalize whitespace (handles multi-line JSX with newlines & indentations)
    if (!translated) {
        const collapsed = trimmed.replace(/[\r\n\s]+/g, ' ');
        translated = getTranslation(collapsed, language);

        // Also normalize hyphens vs em-dashes
        if (!translated) {
            const dashNormalized = collapsed.replace(/[—–]/g, '-');
            translated = getTranslation(dashNormalized, language);
        }
        if (!translated) {
            const emDashNormalized = collapsed.replace(/\s*-\s*/g, '—');
            translated = getTranslation(emDashNormalized, language);
        }
    }

    if (!translated) return value;

    const leading = value.match(/^\s*/)?.[0] ?? '';
    const trailing = value.match(/\s*$/)?.[0] ?? '';
    return `${leading}${translated}${trailing}`;
}

export default function LanguageSwitcher() {
    const [language, setLanguage] = useState<Language>(() => readLanguageFromUrl());

    useEffect(() => {
        const onPopState = () => setLanguage(readLanguageFromUrl());
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    useEffect(() => {
        updateDocumentMeta(language);
        if (language === 'en') return;

        const originals = new Map<Text, string>();
        const attributeOriginals = new Map<Element, Partial<Record<'placeholder' | 'aria-label' | 'alt' | 'title', string>>>();
        const attributes = ['placeholder', 'aria-label', 'alt', 'title'] as const;

        const apply = () => {
            const main = document.querySelector('main');
            if (!main) return;

            const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
                const text = node as Text;
                if (text.parentElement?.closest('script,style,.language-options,pre,code')) continue;

                const current = text.textContent ?? '';
                const storedOriginal = originals.get(text);
                const original = storedOriginal && current === translateValue(storedOriginal, language) ? storedOriginal : current;
                originals.set(text, original);

                const next = translateValue(original, language);
                if (text.textContent !== next) text.textContent = next;
            }

            main.querySelectorAll<HTMLElement>('[placeholder],[aria-label],[alt],[title]').forEach((element) => {
                if (element.closest('.language-options,pre,code')) return;

                const stored = attributeOriginals.get(element) ?? {};
                let changed = false;

                attributes.forEach((attribute) => {
                    const current = element.getAttribute(attribute);
                    if (!current) return;

                    const storedOriginal = stored[attribute];
                    const original = storedOriginal && current === translateValue(storedOriginal, language) ? storedOriginal : current;
                    stored[attribute] = original;

                    const next = translateValue(original, language);
                    if (next !== current) element.setAttribute(attribute, next);
                    changed = true;
                });

                if (changed) attributeOriginals.set(element, stored);
            });
        };

        apply();

        const observer = new MutationObserver(() => {
            observer.disconnect();
            apply();
            const main = document.querySelector('main');
            if (main) observer.observe(main, { attributes: true, attributeFilter: [...attributes], characterData: true, childList: true, subtree: true });
        });

        const main = document.querySelector('main');
        if (main) observer.observe(main, { attributes: true, attributeFilter: [...attributes], characterData: true, childList: true, subtree: true });

        return () => {
            observer.disconnect();
            originals.forEach((value, node) => {
                node.textContent = value;
            });
            attributeOriginals.forEach((values, element) => {
                Object.entries(values).forEach(([attribute, value]) => {
                    element.setAttribute(attribute, value);
                });
            });
        };
    }, [language]);

    return (
        <div className="language-options" aria-label="Language">
            {[
                ['en', 'EN'],
                ['zh', '中文'],
                ['ko', '한국어'],
            ].map(([code, label]) => (
                <a
                    key={code}
                    href={languageHref(code as Language)}
                    lang={code}
                    aria-current={language === code ? 'true' : undefined}
                    onClick={async (event) => {
                        event.preventDefault();
                        const nextLanguage = code as Language;
                        writeLanguageToUrl(nextLanguage);
                        if (nextLanguage === language) return;
                        const main = document.querySelector('main');
                        if (!main || matchMedia('(prefers-reduced-motion: reduce)').matches) {
                            setLanguage(nextLanguage);
                            return;
                        }

                        const targets = Array.from(main.querySelectorAll('h1,h2,h3,p,label,.logo-lockup small'));
                        const fades = targets.map((el) =>
                            el.animate([{ opacity: 1 }, { opacity: .6 }], { duration: 100, fill: 'forwards', easing: 'ease-out' }),
                        );

                        await Promise.all(fades.map((fade) => fade.finished));
                        setLanguage(nextLanguage);
                        requestAnimationFrame(() => requestAnimationFrame(() => {
                            fades.forEach((fade) => fade.cancel());
                            targets.forEach((el) => {
                                el.animate([{ opacity: .6 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' });
                            });
                        }));
                    }}
                >
                    {label}
                </a>
            ))}
        </div>
    );
}
