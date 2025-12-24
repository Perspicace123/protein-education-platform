// ================================================
// app.js - 药物-靶点教育平台主应用脚本
// ================================================

/**
 * 主应用初始化函数
 */
function initializeApp() {
    console.log('🚀 药物-靶点教育平台初始化...');

    // 初始化导航菜单
    initNavigation();

    // 初始化分子查看器
    initMoleculeViewer();

    // 设置页面加载完成后的操作
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ 页面加载完成');

        // 显示当前激活的导航项
        highlightActiveNav();

        // 设置导航点击事件
        setupNavClickEvents();

        // 检查3D查看器状态
        check3DViewerStatus();
    });
}

/**
 * 初始化导航菜单
 */
function initNavigation() {
    console.log('🔧 初始化导航菜单');

    // 获取导航元素
    const navHome = document.getElementById('nav-home');
    const navDataset = document.getElementById('nav-dataset');
    const navAbout = document.querySelector('a[href*="about"]');

    if (!navHome || !navDataset) {
        console.warn('⚠️ 导航元素未找到');
        return;
    }

    // 设置初始激活状态
    navHome.classList.add('active');
    navDataset.classList.remove('active');
}

/**
 * 高亮当前激活的导航项
 */
function highlightActiveNav() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 如果是链接，不阻止默认行为
            if (this.tagName === 'A') return;

            e.preventDefault();

            // 移除所有激活状态
            navItems.forEach(nav => nav.classList.remove('active'));

            // 添加当前激活状态
            this.classList.add('active');

            // 根据点击的导航项执行相应操作
            handleNavClick(this.id);
        });
    });
}

/**
 * 设置导航点击事件
 */
function setupNavClickEvents() {
    // 首页导航
    const navHome = document.getElementById('nav-home');
    if (navHome) {
        navHome.addEventListener('click', function() {
            scrollToSection('moleculeViewer');
            updatePageTitle('药物-靶点交互式学习平台');
        });
    }

    // 示例药物导航
    const navDataset = document.getElementById('nav-dataset');
    if (navDataset) {
        navDataset.addEventListener('click', function() {
            showDrugDataset();
        });
    }
}

/**
 * 处理导航点击
 */
function handleNavClick(navId) {
    switch(navId) {
        case 'nav-home':
            scrollToTop();
            break;

        case 'nav-dataset':
            showDrugExamples();
            break;

        default:
            console.log(`导航点击: ${navId}`);
    }
}

/**
 * 滚动到指定部分
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * 滚动到顶部
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 更新页面标题
 */
function updatePageTitle(title) {
    document.title = title;
}

/**
 * 显示药物数据集
 */
function showDrugDataset() {
    console.log('💊 显示药物数据集');

    // 这里可以添加显示药物列表的逻辑
    // 例如：动态加载药物信息卡片

    // 临时提示
    const message = `
        <div style="padding: 20px; background: #f8f9fa; border-radius: 10px; margin: 20px 0;">
            <h3>💊 示例药物库</h3>
            <p>当前包含的药物-靶点复合物：</p>
            <ul>
                <li><strong>阿司匹林</strong> (Aspirin) - COX-1抑制剂</li>
                <li><strong>阿托伐他汀</strong> (Atorvastatin) - HMGCR抑制剂</li>
                <li><strong>奈玛特韦</strong> (Nirmatrelvir) - SARS-CoV-2 Mpro抑制剂</li>
            </ul>
            <p>点击左侧3D查看器中的按钮查看具体结构。</p>
        </div>
    `;

    // 你可以在这里添加代码来显示药物数据集
    // 例如：更新某个容器的内容
}

/**
 * 显示药物示例
 */
function showDrugExamples() {
    const mainContent = document.querySelector('main.container');
    if (!mainContent) return;

    const drugExamplesHTML = `
        <section class="drug-examples" style="padding: 40px 20px;">
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 30px;">
                💊 药物作用机制示例
            </h2>

            <div class="drug-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">

                <!-- 阿司匹林卡片 -->
                <div class="drug-card" style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
                    <h3 style="color: #e74c3c; margin-top: 0;">阿司匹林 (Aspirin)</h3>
                    <div style="margin-bottom: 15px;">
                        <strong>靶点：</strong>环氧合酶-1 (COX-1)<br>
                        <strong>PDB ID：</strong>4LHF<br>
                        <strong>作用机制：</strong>共价抑制
                    </div>
                    <p>不可逆乙酰化Ser530位点，抑制前列腺素合成，发挥解热、镇痛、抗炎作用。</p>
                    <button onclick="loadDrugExample('4LHF')"
                            style="background: #3498db; color: white; border: none; padding: 10px 20px;
                                   border-radius: 6px; cursor: pointer; margin-top: 15px;">
                        查看3D结构
                    </button>
                </div>

                <!-- 阿托伐他汀卡片 -->
                <div class="drug-card" style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
                    <h3 style="color: #2ecc71; margin-top: 0;">阿托伐他汀 (Atorvastatin)</h3>
                    <div style="margin-bottom: 15px;">
                        <strong>靶点：</strong>HMG-CoA还原酶 (HMGCR)<br>
                        <strong>PDB ID：</strong>8QEB<br>
                        <strong>作用机制：</strong>竞争性抑制
                    </div>
                    <p>抑制胆固醇合成限速酶，降低血浆胆固醇水平，用于预防心血管疾病。</p>
                    <button onclick="loadDrugExample('8QEB')"
                            style="background: #2ecc71; color: white; border: none; padding: 10px 20px;
                                   border-radius: 6px; cursor: pointer; margin-top: 15px;">
                        查看3D结构
                    </button>
                </div>

                <!-- 奈玛特韦卡片 -->
                <div class="drug-card" style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
                    <h3 style="color: #9b59b6; margin-top: 0;">奈玛特韦 (Nirmatrelvir)</h3>
                    <div style="margin-bottom: 15px;">
                        <strong>靶点：</strong>SARS-CoV-2主要蛋白酶 (Mpro)<br>
                        <strong>PDB ID：</strong>7BQY<br>
                        <strong>作用机制：</strong>共价抑制
                    </div>
                    <p>Paxlovid®活性成分，抑制病毒主要蛋白酶，阻断病毒复制，用于COVID-19治疗。</p>
                    <button onclick="loadDrugExample('7BQY')"
                            style="background: #9b59b6; color: white; border: none; padding: 10px 20px;
                                   border-radius: 6px; cursor: pointer; margin-top: 15px;">
                        查看3D结构
                    </button>
                </div>
            </div>
        </section>
    `;

    // 插入到页面中
    const viewerSection = document.getElementById('moleculeViewer');
    if (viewerSection) {
        viewerSection.insertAdjacentHTML('afterend', drugExamplesHTML);
        scrollToSection('moleculeViewer');
    }
}

/**
 * 加载药物示例到3D查看器
 */
function loadDrugExample(pdbId) {
    console.log(`加载药物示例: ${pdbId}`);

    // 滚动到3D查看器
    scrollToSection('moleculeViewer');

    // 模拟点击对应的分子按钮
    const moleculeBtn = document.querySelector(`.molecule-btn[data-pdb="${pdbId}"]`);
    if (moleculeBtn) {
        moleculeBtn.click();
    } else {
        console.warn(`未找到PDB ID为 ${pdbId} 的按钮`);
        alert(`请先在3D查看器中选择 ${pdbId}`);
    }
}

/**
 * 检查3D查看器状态
 */
function check3DViewerStatus() {
    setTimeout(() => {
        const viewerElement = document.getElementById('molViewer3D');
        const currentMolecule = document.getElementById('currentMolecule');

        if (viewerElement && currentMolecule.textContent === '正在加载...') {
            console.log('⚠️ 3D查看器可能加载缓慢，检查PDB文件...');

            // 可以在这里添加加载状态检查或重试逻辑
        }
    }, 3000); // 3秒后检查
}

/**
 * 初始化分子查看器（与HTML中的脚本集成）
 */
function initMoleculeViewer() {
    console.log('🔬 初始化分子查看器');

    // 这里可以添加额外的初始化逻辑
    // 例如：检查PDB文件可用性、设置默认参数等

    // 监听窗口大小变化，调整3D查看器
    window.addEventListener('resize', function() {
        console.log('🔄 窗口大小变化，可能需要调整3D查看器');
        // 可以在这里添加响应式调整逻辑
    });
}

/**
 * 错误处理函数
 */
function handleError(error, context) {
    console.error(`❌ ${context}:`, error);

    // 显示用户友好的错误消息
    const errorMessage = `
        <div style="position: fixed; top: 20px; right: 20px; background: #e74c3c; color: white;
                    padding: 15px; border-radius: 8px; z-index: 1000; max-width: 300px;">
            <strong>操作遇到问题</strong><br>
            ${error.message || '未知错误'}
            <button onclick="this.parentElement.remove()"
                    style="background: transparent; border: 1px solid white; color: white;
                           margin-left: 10px; padding: 2px 8px; border-radius: 4px;">
                关闭
            </button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', errorMessage);
}

/**
 * 工具函数：获取URL参数
 */
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * 工具函数：防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ================================================
// 导出函数（如果其他脚本需要）
// ================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        loadDrugExample,
        scrollToSection
    };
}

// ================================================
// 启动应用
// ================================================

// 确保页面完全加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// 全局错误处理
window.addEventListener('error', function(event) {
    handleError(event.error, '全局错误');
});

// 未处理的Promise拒绝
window.addEventListener('unhandledrejection', function(event) {
    handleError(event.reason, '未处理的Promise拒绝');
});

console.log('📦 app.js 加载完成');