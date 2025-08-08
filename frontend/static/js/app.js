// 主应用程序类
class CryptoApp {
    constructor() {
        this.apiService = new APIService();
        this.errorHandler = new ErrorHandler();
        this.chartManager = new ChartManager();
        this.currentPage = 'home';
        this.refreshInterval = null;
        this.isInitialized = false;
    }

    /**
     * 初始化应用程序
     */
    async init() {
        try {
            console.log('初始化加密货币监控应用...');
            
            // 检查API连接
            await this.checkAPIConnection();
            
            // 初始化页面
            this.initializePages();
            
            // 绑定事件
            this.bindEvents();
            
            // 加载初始数据
            await this.loadInitialData();
            
            // 启动自动刷新
            this.startAutoRefresh();
            
            this.isInitialized = true;
            console.log('应用程序初始化完成');
            
        } catch (error) {
            console.error('应用程序初始化失败:', error);
            this.errorHandler.showError('应用程序初始化失败，请检查网络连接');
        }
    }

    /**
     * 检查API连接
     */
    async checkAPIConnection() {
        try {
            const response = await this.apiService.healthCheck();
            if (response.status === 'healthy') {
                console.log('API连接正常');
                return true;
            }
        } catch (error) {
            console.error('API连接失败:', error);
            throw new Error('无法连接到后端服务');
        }
    }

    /**
     * 初始化页面
     */
    initializePages() {
        // 显示首页
        this.showPage('home');
        
        // 初始化图表
        this.chartManager.initMainChart();
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 导航事件
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.showPage(page);
            });
        });

        // 刷新按钮事件
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // 时间框架选择事件
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const timeframe = e.target.getAttribute('data-timeframe');
                this.changeTimeframe(timeframe);
            });
        });

        // 加密货币选择事件
        document.querySelectorAll('.crypto-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const crypto = e.target.getAttribute('data-crypto');
                this.changeCrypto(crypto);
            });
        });
    }

    /**
     * 显示指定页面
     * @param {string} pageName - 页面名称
     */
    showPage(pageName) {
        // 如果是相同页面，不需要切换
        if (this.currentPage === pageName) {
            return;
        }
        
        console.log(`🔄 页面切换: ${this.currentPage} -> ${pageName}`);
        
        // 取消所有进行中的API请求
        this.apiService.cancelAllRequests();
        
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });

        // 显示指定页面
        const targetPage = document.getElementById(`${pageName}Page`);
        if (targetPage) {
            targetPage.style.display = 'block';
            this.currentPage = pageName;
            
            // 更新导航状态
            this.updateNavigation(pageName);
            
            // 延迟加载页面数据，避免与取消请求冲突
            setTimeout(() => {
                this.loadPageData(pageName);
            }, 100);
        }
    }

    /**
     * 更新导航状态
     * @param {string} activePage - 当前活跃页面
     */
    updateNavigation(activePage) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === activePage) {
                link.classList.add('active');
            }
        });
    }

    /**
     * 加载页面数据
     * @param {string} pageName - 页面名称
     */
    async loadPageData(pageName) {
        try {
            switch (pageName) {
                case 'home':
                    await this.loadHomeData();
                    break;
                case 'bitcoin':
                    await this.loadBitcoinData();
                    break;
                case 'ethereum':
                    await this.loadEthereumData();
                    break;
                case 'kline':
                    await this.loadKlineData();
                    break;
            }
        } catch (error) {
            console.error(`加载${pageName}页面数据失败:`, error);
            this.errorHandler.showError(`加载${pageName}页面数据失败`);
        }
    }

    /**
     * 加载首页数据
     */
    async loadHomeData() {
        try {
            // 加载最新价格
            const latestPrices = await this.apiService.getLatestPrices();
            this.updatePriceDisplay(latestPrices);

            // 加载主图表数据
            const chartData = await this.apiService.getChartData(
                this.chartManager.currentCrypto,
                this.chartManager.currentTimeframe
            );
            this.chartManager.updateMainChart(chartData);

        } catch (error) {
            console.error('加载首页数据失败:', error);
            throw error;
        }
    }

    /**
     * 加载比特币数据
     */
    async loadBitcoinData() {
        try {
            this.chartManager.initBTCChart();
            const btcData = await this.apiService.getBTCChartData();
            this.chartManager.updateBTCChart(btcData);
            
            // 加载BTC分析报告
            const analysis = await this.apiService.getAnalysisReport('BTC');
            this.updateAnalysisDisplay('bitcoin', analysis);
            
        } catch (error) {
            console.error('加载比特币数据失败:', error);
            throw error;
        }
    }

    /**
     * 加载以太坊数据
     */
    async loadEthereumData() {
        try {
            this.chartManager.initETHChart();
            const ethData = await this.apiService.getETHChartData();
            this.chartManager.updateETHChart(ethData);
            
            // 加载ETH分析报告
            const analysis = await this.apiService.getAnalysisReport('ETH');
            this.updateAnalysisDisplay('ethereum', analysis);
            
        } catch (error) {
            console.error('加载以太坊数据失败:', error);
            throw error;
        }
    }

    /**
     * 加载K线数据
     */
    async loadKlineData() {
        try {
            this.chartManager.initKlineChart();
            const klineData = await this.apiService.getKlineChartData();
            this.chartManager.updateKlineChart(klineData);
            
        } catch (error) {
            console.error('加载K线数据失败:', error);
            throw error;
        }
    }

    /**
     * 加载初始数据
     */
    async loadInitialData() {
        await this.loadHomeData();
    }

    /**
     * 更新价格显示
     * @param {Object} response - API响应数据
     */
    updatePriceDisplay(response) {
        if (!response || !response.data) return;

        const priceList = document.getElementById('priceList');
        if (!priceList) return;

        // 清空加载提示
        priceList.innerHTML = '';

        // 处理价格数据数组
        const priceData = response.data;
        
        priceData.forEach(item => {
            const priceItem = document.createElement('div');
            priceItem.className = 'price-item';
            priceItem.setAttribute('data-symbol', item.symbol);

            const change = parseFloat(item.change_24h) || 0;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeIcon = change >= 0 ? '↑' : '↓';

            const iconPath = item.symbol === 'BTC' ? 'static/icons/bitcoin.svg' : 'static/icons/ethereum.svg';
            
            priceItem.innerHTML = `
                <div class="crypto-info">
                    <img src="${iconPath}" alt="${item.symbol}" class="crypto-icon">
                    <div>
                        <span class="crypto-symbol">${item.symbol}</span>
                        <span class="crypto-name">${item.name}</span>
                    </div>
                </div>
                <div class="price-info">
                    <div class="current-price">$${parseFloat(item.price).toLocaleString()}</div>
                    <div class="price-change ${changeClass}">
                        ${changeIcon} ${Math.abs(change).toFixed(2)}%
                    </div>
                </div>
            `;
            
            priceList.appendChild(priceItem);

            // 更新详情页面的价格显示
            if (item.symbol === 'BTC') {
                const btcPriceElement = document.getElementById('btcPrice');
                const btcChangeElement = document.getElementById('btcChange');
                
                if (btcPriceElement) {
                    btcPriceElement.textContent = `$${parseFloat(item.price).toLocaleString()}`;
                }
                
                if (btcChangeElement) {
                    btcChangeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
                    btcChangeElement.className = `crypto-change ${changeClass}`;
                }
            } else if (item.symbol === 'ETH') {
                const ethPriceElement = document.getElementById('ethPrice');
                const ethChangeElement = document.getElementById('ethChange');
                
                if (ethPriceElement) {
                    ethPriceElement.textContent = `$${parseFloat(item.price).toLocaleString()}`;
                }
                
                if (ethChangeElement) {
                    ethChangeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
                    ethChangeElement.className = `crypto-change ${changeClass}`;
                }
            }
        });

        // 更新最后更新时间
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = new Date().toLocaleTimeString();
        }
    }

    /**
     * 更新分析显示
     * @param {string} page - 页面名称
     * @param {Object} analysis - 分析数据
     */
    updateAnalysisDisplay(page, analysis) {
        const analysisElement = document.getElementById(`${page}Analysis`);
        if (analysisElement && analysis) {
            analysisElement.innerHTML = `
                <h4>技术分析</h4>
                <p><strong>趋势:</strong> ${analysis.trend || '未知'}</p>
                <p><strong>支撑位:</strong> $${analysis.support || 'N/A'}</p>
                <p><strong>阻力位:</strong> $${analysis.resistance || 'N/A'}</p>
                <p><strong>建议:</strong> ${analysis.recommendation || '无'}</p>
            `;
        }
    }

    /**
     * 刷新数据
     */
    async refreshData() {
        try {
            const refreshBtn = document.querySelector('.refresh-btn');
            if (refreshBtn) {
                refreshBtn.disabled = true;
                refreshBtn.textContent = '🔄 刷新中...';
            }

            // 直接调用对应页面的数据加载方法，避免循环调用
            switch (this.currentPage) {
                case 'home':
                    await this.loadHomeData();
                    break;
                case 'bitcoin':
                    await this.loadBitcoinData();
                    break;
                case 'ethereum':
                    await this.loadEthereumData();
                    break;
                case 'kline':
                    await this.loadKlineData();
                    break;
            }
            
            this.errorHandler.showSuccess('数据刷新成功');

        } catch (error) {
            console.error('刷新数据失败:', error);
            this.errorHandler.showError('数据刷新失败');
        } finally {
            const refreshBtn = document.querySelector('.refresh-btn');
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.textContent = '🔄 刷新数据';
            }
        }
    }

    /**
     * 改变时间框架
     * @param {string} timeframe - 时间框架
     */
    async changeTimeframe(timeframe) {
        try {
            this.chartManager.setCurrentTimeframe(timeframe);
            
            // 更新按钮状态
            document.querySelectorAll('.timeframe-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-timeframe') === timeframe) {
                    btn.classList.add('active');
                }
            });

            // 重新加载当前页面数据
            await this.loadPageData(this.currentPage);
            
        } catch (error) {
            console.error('改变时间框架失败:', error);
            this.errorHandler.showError('改变时间框架失败');
        }
    }

    /**
     * 改变加密货币
     * @param {string} crypto - 加密货币符号
     */
    async changeCrypto(crypto) {
        try {
            this.chartManager.setCurrentCrypto(crypto);
            
            // 更新按钮状态
            document.querySelectorAll('.crypto-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-crypto') === crypto) {
                    btn.classList.add('active');
                }
            });

            // 重新加载主图表数据
            if (this.currentPage === 'home') {
                const chartData = await this.apiService.getChartData(crypto, this.chartManager.currentTimeframe);
                this.chartManager.updateMainChart(chartData);
            }
            
        } catch (error) {
            console.error('改变加密货币失败:', error);
            this.errorHandler.showError('改变加密货币失败');
        }
    }

    /**
     * 启动自动刷新
     */
    startAutoRefresh() {
        // 清除现有的定时器
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        // 设置新的定时器
        this.refreshInterval = setInterval(async () => {
            try {
                if (this.currentPage === 'home') {
                    const latestPrices = await this.apiService.getLatestPrices();
                    this.updatePriceDisplay(latestPrices);
                }
            } catch (error) {
                console.error('自动刷新失败:', error);
            }
        }, APP_CONFIG.REFRESH_INTERVAL);
    }

    /**
     * 停止自动刷新
     */
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    /**
     * 销毁应用程序
     */
    destroy() {
        this.stopAutoRefresh();
        this.chartManager.destroyAllCharts();
        this.isInitialized = false;
    }
}

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.destroy();
    }
});