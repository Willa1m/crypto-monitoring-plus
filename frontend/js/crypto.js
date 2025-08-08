// 加密货币监控系统JavaScript

// 全局变量
let currentTimeframe = 'hour';
let currentSymbol = 'BTC';
let priceChart = null;
let previousPrices = {}; // 存储上一次的价格数据
let priceUpdateInterval = null; // 价格更新定时器

// 计算曲线与平均值的交点并创建分段数据
function calculateIntersectionSegments(data, averagePrice) {
    const aboveAverage = [];
    const belowAverage = [];
    
    for (let i = 0; i < data.length; i++) {
        const currentPoint = data[i];
        const currentY = currentPoint.y;
        
        // 添加当前点到相应的数组
        if (currentY >= averagePrice) {
            aboveAverage.push(currentPoint);
            belowAverage.push({...currentPoint, y: null}); // 添加null值以断开线段
        } else {
            belowAverage.push(currentPoint);
            aboveAverage.push({...currentPoint, y: null}); // 添加null值以断开线段
        }
        
        // 检查是否与下一个点之间有交点
        if (i < data.length - 1) {
            const nextPoint = data[i + 1];
            const nextY = nextPoint.y;
            
            // 检查是否跨越平均线
            if ((currentY >= averagePrice && nextY < averagePrice) || 
                (currentY < averagePrice && nextY >= averagePrice)) {
                
                // 计算交点
                const intersection = calculateLineIntersection(
                    currentPoint.x, currentY,
                    nextPoint.x, nextY,
                    averagePrice
                );
                
                // 将交点添加到两个数组中
                aboveAverage.push(intersection);
                belowAverage.push(intersection);
            }
        }
    }
    
    return {
        aboveAverage: aboveAverage,
        belowAverage: belowAverage
    };
}

// 计算两点之间与水平线的交点
function calculateLineIntersection(x1, y1, x2, y2, horizontalY) {
    // 如果两点的y值相同，没有交点
    if (y1 === y2) {
        return null;
    }
    
    // 计算交点的x坐标
    const t = (horizontalY - y1) / (y2 - y1);
    const intersectionX = x1 + t * (x2 - x1);
    
    return {
        x: intersectionX,
        y: horizontalY
    };
}

// 加载最新价格
function loadLatestPrices() {
    setStatus('正在获取最新价格...', 'loading');

    fetch('/api/latest_prices')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
        .then(response => {
            if (response.success && response.data) {
                displayPrices(response.data);
                setStatus('价格数据已更新', 'info');
                updateLastUpdated();
            } else {
                throw new Error('获取数据失败');
            }
        })
        .catch(error => {
            console.error('获取价格数据时出错:', error);
            setStatus('获取价格数据失败', 'error');
        });
}

// 显示价格数据
function displayPrices(data) {
    const priceList = document.getElementById('priceList');
    if (!priceList) return;
    
    // 确保data是数组
    const priceData = Array.isArray(data) ? data : (data.data || []);
    
    // 获取每个symbol的最新价格（第一条记录）
    const latestPrices = {};
    priceData.forEach(item => {
        if (!latestPrices[item.symbol]) {
            latestPrices[item.symbol] = item;
        }
    });
    
    // 显示每个加密货币的最新价格
    Object.values(latestPrices).forEach(item => {
        const currentPrice = parseFloat(item.price);
        const priceChange = parseFloat(item.change_24h);
        const changeClass = priceChange >= 0 ? 'positive' : 'negative';
        const changeIcon = priceChange >= 0 ? '↑' : '↓';
        
        // 检查是否已存在该货币的价格项
        let priceItem = document.querySelector(`[data-symbol="${item.symbol}"]`);
        
        if (!priceItem) {
            // 创建新的价格项
            priceItem = document.createElement('div');
            priceItem.className = 'price-item';
            priceItem.setAttribute('data-symbol', item.symbol);
            priceList.appendChild(priceItem);
        }
        
        // 检查价格是否发生变化
        const previousPrice = previousPrices[item.symbol];
        let priceChangeDirection = '';
        
        if (previousPrice !== undefined && previousPrice !== currentPrice) {
            priceChangeDirection = currentPrice > previousPrice ? 'price-up' : 'price-down';
            
            // 添加闪烁动画类
            priceItem.classList.add('price-flash', priceChangeDirection);
            
            // 移除动画类
            setTimeout(() => {
                priceItem.classList.remove('price-flash', 'price-up', 'price-down');
            }, 1000);
        }
        
        // 更新价格项内容
        priceItem.innerHTML = `
            <div class="crypto-info">
                <div>
                    <span class="crypto-symbol">${item.symbol}</span>
                    <span class="crypto-name">${item.name}</span>
                </div>
            </div>
            <div class="price-info">
                <div class="current-price ${priceChangeDirection}">$${currentPrice.toLocaleString()}</div>
                <div class="price-change ${changeClass}">
                    ${changeIcon} ${Math.abs(priceChange).toFixed(2)}%
                </div>
            </div>
        `;
        
        // 存储当前价格
        previousPrices[item.symbol] = currentPrice;
    });
}

// 加载图表
function loadChart(symbol = 'BTC') {
    setStatus('正在加载图表数据...', 'loading');
    
    fetch(`/api/chart_data?timeframe=${currentTimeframe}&symbol=${symbol}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
        .then(response => {
            if (response.success && response.data) {
                displayChart(response.data, symbol, currentTimeframe);
                setStatus('图表数据已更新', 'info');
                updateLastUpdated();
            } else {
                throw new Error('获取数据失败');
            }
        })
        .catch(error => {
            console.error('获取图表数据时出错:', error);
            setStatus('获取图表数据失败', 'error');
        });
}

// 显示图表
function displayChart(data, symbol = 'BTC', timeframe = 'hour') {
    const chartContainer = document.getElementById('chartContainer');
    
    if (!chartContainer) {
        console.error('图表容器未找到');
        return;
    }
    
    const canvas = document.getElementById('priceChart');
    if (!canvas) {
        console.error('图表canvas未找到');
        return;
    }
    
    // 检查数据
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('图表数据为空或格式错误');
        return;
    }
    
    try {
        const ctx = canvas.getContext('2d');
        
        // 销毁现有图表
        if (priceChart) {
            priceChart.destroy();
        }
        
        // 格式化数据并计算平均值
        const formattedData = data.map(item => ({
            x: new Date(item.date).getTime(),
            y: parseFloat(item.close) || 0
        }));
        
        // 计算平均价格
        const prices = formattedData.map(item => item.y);
        const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        
        // 计算与平均值的交点并创建分段数据
        const segmentedData = calculateIntersectionSegments(formattedData, averagePrice);
        
        // 配置图表
        const config = {
            type: 'line',
            data: {
                datasets: [
                    // 高于平均值的绿色线段
                    {
                        label: `${symbol} 价格 (高于平均)`,
                        data: segmentedData.aboveAverage,
                        borderColor: '#22c55e',
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        borderWidth: 3,
                        fill: false,
                        spanGaps: false
                    },
                    // 低于平均值的红色线段
                    {
                        label: `${symbol} 价格 (低于平均)`,
                        data: segmentedData.belowAverage,
                        borderColor: '#ef4444',
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        borderWidth: 3,
                        fill: false,
                        spanGaps: false
                    },
                    // 平均线
                    {
                        label: '平均价格',
                        data: formattedData.map(item => ({
                            x: item.x,
                            y: averagePrice
                        })),
                        borderColor: '#e2e8f0',
                        backgroundColor: 'transparent',
                        borderDash: [3, 3],
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: true,
                    mode: 'nearest'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                            boxHeight: 8,
                            padding: 15,
                            font: {
                                size: 11,
                                weight: '400'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1a202c',
                        bodyColor: '#4a5568',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                if (context.parsed.y === null) return null;
                                const price = context.parsed.y;
                                const isAboveAverage = price >= averagePrice;
                                const status = isAboveAverage ? '↗ 高于平均' : '↘ 低于平均';
                                return [
                                    `价格: $${price.toLocaleString()}`,
                                    `${status} ($${averagePrice.toLocaleString()})`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: false
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            display: true,
                            maxRotation: 0,
                            padding: 10,
                            color: '#94a3b8',
                            callback: function(value, index) {
                                // 只显示部分刻度标签
                                if (index % Math.ceil(data.length / 6) === 0) {
                                    const date = new Date(data[index]?.date || value);
                                    if (timeframe === 'minute') {
                                        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
                                    } else if (timeframe === 'hour') {
                                        return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + ' ' + 
                                               date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
                                    } else {
                                        return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
                                    }
                                }
                                return '';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: false
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            display: true,
                            padding: 10,
                            color: '#94a3b8',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        };
        
        // 创建图表
        priceChart = new Chart(ctx, config);
        
        // 更新统计信息
        updateChartStats(data, symbol, timeframe);
        
    } catch (error) {
        console.error('创建图表时出错:', error);
        setStatus('图表创建失败', 'error');
    }
}

// 更新图表统计信息
function updateChartStats(data, symbol, timeframe) {
    if (!data || data.length === 0) return;
    
    const prices = data.map(item => parseFloat(item.close));
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const currentPrice = prices[prices.length - 1];
    const firstPrice = prices[0];
    const priceChange = ((currentPrice - firstPrice) / firstPrice) * 100;
    
    // 更新统计显示
    const statsContainer = document.getElementById('chartStats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">当前价格</span>
                <span class="stat-value">$${currentPrice.toLocaleString()}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">最高价</span>
                <span class="stat-value">$${maxPrice.toLocaleString()}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">最低价</span>
                <span class="stat-value">$${minPrice.toLocaleString()}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">平均价</span>
                <span class="stat-value">$${averagePrice.toLocaleString()}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">涨跌幅</span>
                <span class="stat-value ${priceChange >= 0 ? 'positive' : 'negative'}">
                    ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%
                </span>
            </div>
        `;
    }
}

// 更新最后更新时间
function updateLastUpdated() {
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate) {
        const now = new Date();
        lastUpdate.textContent = now.toLocaleTimeString();
    }
}

// 设置状态
function setStatus(message, type = 'info') {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    if (!indicator || !statusText) return;
    
    // 清除所有状态类
    indicator.classList.remove('loading', 'error');
    
    // 设置新状态
    statusText.textContent = message;
    
    if (type === 'loading') {
        indicator.classList.add('loading');
    } else if (type === 'error') {
        indicator.classList.add('error');
    }
}

// 刷新所有数据
function refreshData() {
    loadLatestPrices();
    loadChart(currentSymbol);
}

// 切换加密货币
function changeCrypto(symbol) {
    currentSymbol = symbol;
    
    // 更新按钮状态
    document.querySelectorAll('.crypto-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim() === symbol) {
            btn.classList.add('active');
        }
    });
    
    // 重新加载图表
    loadChart(symbol);
}

// 切换时间范围
function changeTimeframe(timeframe) {
    if (timeframe === currentTimeframe) return;
    
    // 更新当前选择的时间范围
    currentTimeframe = timeframe;
    
    // 更新按钮状态
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 根据timeframe找到对应的按钮并激活
    const timeframeMap = {
        'minute': '分钟',
        'hour': '小时', 
        'day': '天'
    };
    
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        if (btn.textContent.trim() === timeframeMap[timeframe]) {
            btn.classList.add('active');
        }
    });
    
    // 重新加载图表
    loadChart(currentSymbol);
}

// 启动优化的更新策略
function startOptimizedUpdates() {
    // 清除现有的定时器
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
    }
    
    // 价格显示更新：每30秒检查一次
    priceUpdateInterval = setInterval(() => {
        loadLatestPrices();
        updateLastUpdated();
    }, 30000);
    
    // 图表数据更新：每5分钟更新一次
    setInterval(() => {
        loadChart(currentSymbol);
    }, 300000);
    
    console.log('⏰ 优化更新策略已启动');
    console.log('   - 价格显示: 每30秒更新');
    console.log('   - 图表数据: 每5分钟更新');
}

// 停止实时价格更新
function stopRealTimePriceUpdates() {
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
        priceUpdateInterval = null;
    }
}

// 处理页面可见性变化
function handleVisibilityChange() {
    if (document.hidden) {
        // 页面隐藏时暂停更新
        if (priceUpdateInterval) {
            clearInterval(priceUpdateInterval);
            console.log('⏸️ 页面隐藏，暂停更新');
        }
    } else {
        // 页面显示时恢复更新
        startOptimizedUpdates();
        loadLatestPrices();
        console.log('▶️ 页面显示，恢复更新');
    }
}

// 页面卸载时清理
window.addEventListener('beforeunload', function() {
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
    }
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 加密货币监控系统初始化...');
    
    // 初始化加载
    loadLatestPrices();
    loadChart(currentSymbol);
    
    // 启动优化的更新策略
    startOptimizedUpdates();
    
    // 添加页面可见性检测
    document.addEventListener('visibilitychange', handleVisibilityChange);
});