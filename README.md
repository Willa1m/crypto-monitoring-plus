# 🚀 Crypto Monitoring Plus - 企业级加密货币监控系统

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-green.svg)](https://flask.palletsprojects.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docs.docker.com/compose/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-7.0-red.svg)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 一个功能完整的企业级加密货币实时监控和分析系统，采用微服务架构，支持Docker容器化部署，提供实时价格追踪、技术指标分析和交互式图表展示。

## 📋 目录

- [✨ 功能特性](#-功能特性)
- [🏗️ 系统架构](#️-系统架构)
- [🚀 快速开始](#-快速开始)
- [📦 安装部署](#-安装部署)
- [⚙️ 配置说明](#️-配置说明)
- [🎯 使用指南](#-使用指南)
- [📚 API文档](#-api文档)
- [🔧 开发指南](#-开发指南)
- [📁 项目结构](#-项目结构)
- [🤝 贡献指南](#-贡献指南)
- [📄 许可证](#-许可证)

## ✨ 功能特性

### 🔥 核心功能
- **实时价格监控**: 支持Bitcoin (BTC)、Ethereum (ETH)等主流加密货币
- **多时间维度数据**: 分钟级、小时级、日级数据采集和存储
- **技术指标分析**: 移动平均线、RSI、MACD、布林带等技术指标
- **交互式图表**: 基于Chart.js的高性能K线图和价格走势图
- **实时数据推送**: WebSocket实时数据更新
- **智能缓存**: Redis缓存机制，提升数据访问速度10倍以上

### 🌐 Web界面特性
- **响应式设计**: 完美支持桌面、平板和移动设备
- **现代化UI**: 采用现代化设计语言，用户体验优秀
- **多主题支持**: 支持明暗主题切换
- **多语言支持**: 中英文界面切换
- **实时更新**: 无需刷新页面即可获取最新数据

### 🔧 技术特性
- **微服务架构**: 前后端分离，模块化设计
- **容器化部署**: Docker Compose一键部署
- **高可用性**: 支持负载均衡和故障转移
- **数据安全**: 数据加密存储，API安全认证
- **监控告警**: 系统健康检查和性能监控
- **扩展性**: 易于添加新的加密货币和数据源

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Nginx 反向代理                           │
│                    (负载均衡 + SSL终端)                         │
└─────────────────┬───────────────────────┬───────────────────────┘
                  │                       │
                  ▼                       ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│         前端服务             │ │         后端API服务          │
│      (React/Vue.js)         │ │       (Flask + Python)      │
│    - 用户界面               │ │    - RESTful API            │
│    - 图表展示               │ │    - 数据处理逻辑            │
│    - 实时更新               │ │    - 业务逻辑               │
└─────────────────────────────┘ └─────────────┬───────────────┘
                                              │
                  ┌───────────────────────────┼───────────────────────────┐
                  │                           │                           │
                  ▼                           ▼                           ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐ ┌─────────────────────────────┐
│        Redis 缓存           │ │       MySQL 数据库          │ │      外部数据源             │
│    - 实时数据缓存           │ │    - 历史数据存储           │ │    - CoinDesk API           │
│    - 会话管理               │ │    - 用户数据               │ │    - Binance API            │
│    - 任务队列               │ │    - 系统配置               │ │    - CoinGecko API          │
└─────────────────────────────┘ └─────────────────────────────┘ └─────────────────────────────┘
```

### 数据流架构
```
外部API → 数据采集器 → 数据处理器 → MySQL存储 → Redis缓存 → Web API → 前端展示
    ↓           ↓           ↓           ↓           ↓         ↓         ↓
CoinDesk    定时任务     技术指标     历史数据     实时缓存   RESTful   图表展示
Binance     异常处理     数据清洗     备份恢复     会话管理   WebSocket  实时更新
```

## 🚀 快速开始

### 前置要求
- Docker 20.10+
- Docker Compose 2.0+
- Git
- 4GB+ 可用内存
- 10GB+ 可用磁盘空间

### 一键部署
```bash
# 1. 克隆项目
git clone https://github.com/your-username/crypto-monitoring-plus.git
cd crypto-monitoring-plus

# 2. 启动所有服务
docker-compose up -d

# 3. 等待服务启动完成（约2-3分钟）
docker-compose logs -f

# 4. 访问应用
# 前端界面: http://localhost:80
# API文档: http://localhost:8000/api/docs
# 系统监控: http://localhost:8000/health
```

### 验证部署
```bash
# 检查所有服务状态
docker-compose ps

# 查看服务日志
docker-compose logs backend
docker-compose logs frontend

# 测试API连接
curl http://localhost:8000/api/health
```

## 📦 安装部署

### 开发环境部署

#### 1. 环境准备
```bash
# 创建项目目录
mkdir crypto-monitoring-plus
cd crypto-monitoring-plus

# 克隆代码
git clone https://github.com/your-username/crypto-monitoring-plus.git .

# 创建Python虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

#### 2. 后端部署
```bash
# 进入后端目录
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 启动后端服务
python crypto_web_app.py
```

#### 3. 前端部署
```bash
# 进入前端目录
cd frontend

# 安装依赖（如果使用Node.js）
npm install

# 启动前端服务
npm start
# 或直接使用静态文件服务器
python -m http.server 8080
```

#### 4. 数据库配置
```sql
-- 创建数据库
CREATE DATABASE crypto_monitoring CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'crypto_user'@'%' IDENTIFIED BY 'crypto_pass_2024';
GRANT ALL PRIVILEGES ON crypto_monitoring.* TO 'crypto_user'@'%';
FLUSH PRIVILEGES;
```

### 生产环境部署

#### 使用Docker Compose（推荐）
```bash
# 1. 配置生产环境变量
cp .env.example .env.production
# 编辑生产环境配置

# 2. 构建并启动服务
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 3. 配置SSL证书（可选）
# 将SSL证书放置在 nginx/ssl/ 目录下

# 4. 配置域名解析
# 将域名指向服务器IP地址
```

#### 使用Kubernetes（高级）
```bash
# 1. 应用Kubernetes配置
kubectl apply -f k8s/

# 2. 检查部署状态
kubectl get pods -n crypto-monitoring

# 3. 配置Ingress
kubectl apply -f k8s/ingress.yml
```

## ⚙️ 配置说明

### 环境变量配置
```bash
# 数据库配置
DB_HOST=mysql
DB_PORT=3306
DB_NAME=crypto_monitoring
DB_USER=crypto_user
DB_PASSWORD=crypto_pass_2024

# Redis配置
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=crypto_redis_2024

# API配置
COINDESK_API_URL=https://api.coindesk.com/v1/bpi/currentprice.json
BINANCE_API_URL=https://api.binance.com/api/v3/ticker/price

# 系统配置
FLASK_ENV=production
LOG_LEVEL=INFO
DATA_UPDATE_INTERVAL=60
CACHE_TTL=300
```

### 数据库配置
```python
# backend/config/database.py
DATABASE_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'crypto_user'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME', 'crypto_monitoring'),
    'charset': 'utf8mb4',
    'autocommit': True,
    'pool_size': 10,
    'pool_reset_session': True
}
```

### Redis配置
```python
# backend/config/redis.py
REDIS_CONFIG = {
    'host': os.getenv('REDIS_HOST', 'localhost'),
    'port': int(os.getenv('REDIS_PORT', 6379)),
    'password': os.getenv('REDIS_PASSWORD'),
    'db': 0,
    'decode_responses': True,
    'socket_timeout': 5,
    'socket_connect_timeout': 5,
    'retry_on_timeout': True
}
```

## 🎯 使用指南

### Web界面使用

#### 主页功能
- **实时价格展示**: 显示主流加密货币的实时价格
- **价格变化趋势**: 24小时价格变化百分比和趋势图
- **快速导航**: 快速访问各个功能模块

#### 详情页功能
- **价格历史图表**: 可选择不同时间周期的价格走势
- **技术指标分析**: MA、RSI、MACD等技术指标
- **交易量分析**: 成交量变化趋势
- **价格预测**: 基于历史数据的价格预测

#### K线分析页
- **交互式K线图**: 支持缩放、平移、十字线
- **多时间周期**: 1分钟、5分钟、1小时、1天等
- **技术指标叠加**: 可在图表上叠加多种技术指标
- **图表导出**: 支持导出PNG、SVG格式

### API使用示例

#### 获取实时价格
```bash
curl -X GET "http://localhost:8000/api/current-prices" \
     -H "Content-Type: application/json"
```

#### 获取历史数据
```bash
curl -X GET "http://localhost:8000/api/historical-data?symbol=BTC&timeframe=1h&limit=100" \
     -H "Content-Type: application/json"
```

#### 获取技术指标
```bash
curl -X GET "http://localhost:8000/api/indicators?symbol=BTC&indicator=RSI&period=14" \
     -H "Content-Type: application/json"
```

### 命令行工具

#### 数据管理
```bash
# 初始化数据库
python backend/scripts/init_db.py

# 导入历史数据
python backend/scripts/import_data.py --symbol BTC --start-date 2023-01-01

# 备份数据
python backend/scripts/backup_data.py --output backup.sql

# 恢复数据
python backend/scripts/restore_data.py --input backup.sql
```

#### 系统监控
```bash
# 检查系统状态
python backend/scripts/health_check.py

# 查看性能指标
python backend/scripts/performance_monitor.py

# 清理缓存
python backend/scripts/clear_cache.py
```

## 📚 API文档

### 认证
所有API请求都需要在请求头中包含API密钥：
```
Authorization: Bearer YOUR_API_KEY
```

### 端点列表

#### 价格数据
| 方法 | 端点 | 描述 | 参数 |
|------|------|------|------|
| GET | `/api/current-prices` | 获取当前价格 | `symbols` (可选) |
| GET | `/api/historical-data` | 获取历史数据 | `symbol`, `timeframe`, `limit` |
| GET | `/api/price-change` | 获取价格变化 | `symbol`, `period` |

#### 技术指标
| 方法 | 端点 | 描述 | 参数 |
|------|------|------|------|
| GET | `/api/indicators/ma` | 移动平均线 | `symbol`, `period`, `type` |
| GET | `/api/indicators/rsi` | RSI指标 | `symbol`, `period` |
| GET | `/api/indicators/macd` | MACD指标 | `symbol`, `fast`, `slow`, `signal` |

#### 系统管理
| 方法 | 端点 | 描述 | 参数 |
|------|------|------|------|
| GET | `/api/health` | 系统健康检查 | 无 |
| GET | `/api/status` | 系统状态 | 无 |
| POST | `/api/cache/clear` | 清理缓存 | `keys` (可选) |

### 响应格式
```json
{
  "success": true,
  "data": {
    "symbol": "BTC",
    "price": 45000.00,
    "change_24h": 2.5,
    "timestamp": "2024-01-01T12:00:00Z"
  },
  "message": "Success",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### 错误处理
```json
{
  "success": false,
  "error": {
    "code": "INVALID_SYMBOL",
    "message": "Invalid cryptocurrency symbol",
    "details": "Symbol 'XYZ' is not supported"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🔧 开发指南

### 开发环境设置
```bash
# 1. 安装开发依赖
pip install -r requirements-dev.txt

# 2. 配置pre-commit钩子
pre-commit install

# 3. 运行测试
pytest tests/

# 4. 代码格式化
black backend/
flake8 backend/

# 5. 类型检查
mypy backend/
```

### 添加新的加密货币
```python
# 1. 在 backend/config/symbols.py 中添加新符号
SUPPORTED_SYMBOLS = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'ADA': 'Cardano',  # 新增
}

# 2. 在数据采集器中添加数据源
# backend/crypto_scraper.py
def get_ada_price(self):
    # 实现ADA价格获取逻辑
    pass

# 3. 更新前端显示
# frontend/js/crypto.js
const supportedSymbols = ['BTC', 'ETH', 'ADA'];
```

### 添加新的技术指标
```python
# 1. 在 backend/crypto_analyzer.py 中添加指标计算
def calculate_bollinger_bands(self, data, period=20, std_dev=2):
    """计算布林带指标"""
    # 实现布林带计算逻辑
    pass

# 2. 在API中添加端点
# backend/crypto_web_app.py
@app.route('/api/indicators/bollinger', methods=['GET'])
def get_bollinger_bands():
    # 实现API端点
    pass

# 3. 在前端添加图表显示
# frontend/js/indicators.js
function displayBollingerBands(data) {
    // 实现前端显示逻辑
}
```

### 测试指南
```bash
# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/test_crypto_db.py

# 运行特定测试函数
pytest tests/test_crypto_db.py::test_get_current_price

# 生成测试覆盖率报告
pytest --cov=backend tests/

# 运行性能测试
pytest tests/performance/
```

## 📁 项目结构

```
crypto-monitoring-plus/
├── 📁 backend/                    # 后端服务
│   ├── 📁 __pycache__/            # Python缓存文件
│   ├── 📁 data/                   # 数据文件
│   ├── 📁 logs/                   # 日志文件
│   ├── 📁 scripts/                # 脚本工具
│   ├── 📁 tests/                  # 测试文件
│   ├── 📄 crypto_analyzer.py      # 技术指标分析器
│   ├── 📄 crypto_db.py           # 数据库操作
│   ├── 📄 crypto_scraper.py      # 数据采集器
│   ├── 📄 crypto_web_app.py      # Web应用主程序
│   ├── 📄 data_processor.py      # 数据处理器
│   ├── 📄 scheduler.py           # 定时任务调度器
│   ├── 📄 requirements.txt       # Python依赖
│   ├── 📄 Dockerfile             # Docker构建文件
│   └── 📄 init.sql               # 数据库初始化脚本
├── 📁 frontend/                   # 前端服务
│   ├── 📁 css/                   # 样式文件
│   ├── 📁 js/                    # JavaScript文件
│   ├── 📁 icons/                 # 图标资源
│   ├── 📁 static/                # 静态资源
│   ├── 📁 templates/             # HTML模板
│   ├── 📄 index.html             # 主页
│   ├── 📄 Dockerfile             # Docker构建文件
│   └── 📄 nginx.conf             # Nginx配置
├── 📁 nginx/                     # Nginx反向代理
│   ├── 📁 conf.d/               # Nginx配置文件
│   ├── 📁 ssl/                  # SSL证书
│   ├── 📄 Dockerfile            # Docker构建文件
│   └── 📄 nginx.conf            # 主配置文件
├── 📁 k8s/                      # Kubernetes配置
│   ├── 📄 deployment.yml        # 部署配置
│   ├── 📄 service.yml           # 服务配置
│   └── 📄 ingress.yml           # 入口配置
├── 📁 docs/                     # 文档
│   ├── 📄 DEPLOYMENT.md         # 部署文档
│   ├── 📄 PROJECT_STRUCTURE.md  # 项目结构文档
│   └── 📄 SECURITY.md           # 安全文档
├── 📁 config/                   # 配置文件
│   ├── 📄 .env.example          # 环境变量示例
│   └── 📄 requirements.txt      # 全局依赖
├── 📄 docker-compose.yml        # Docker Compose配置
├── 📄 docker-compose.prod.yml   # 生产环境配置
├── 📄 .gitignore               # Git忽略文件
├── 📄 LICENSE                  # 许可证
└── 📄 README.md                # 项目说明文档
```

### 核心模块说明

#### 后端模块
- **crypto_web_app.py**: Flask Web应用主程序，提供RESTful API
- **crypto_db.py**: 数据库操作模块，负责数据的增删改查
- **crypto_scraper.py**: 数据采集模块，从外部API获取价格数据
- **crypto_analyzer.py**: 技术指标分析模块，计算各种技术指标
- **data_processor.py**: 数据处理模块，数据清洗和格式化
- **scheduler.py**: 定时任务调度器，管理数据采集和分析任务

#### 前端模块
- **index.html**: 主页面，展示实时价格和导航
- **js/crypto.js**: 主要JavaScript逻辑，处理数据展示和交互
- **css/style.css**: 样式文件，定义页面外观
- **templates/**: HTML模板文件，各个功能页面

#### 配置模块
- **docker-compose.yml**: Docker容器编排配置
- **nginx/nginx.conf**: Nginx反向代理配置
- **k8s/**: Kubernetes部署配置文件

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

### 贡献流程
1. **Fork项目**: 点击右上角的Fork按钮
2. **创建分支**: `git checkout -b feature/your-feature-name`
3. **提交更改**: `git commit -am 'Add some feature'`
4. **推送分支**: `git push origin feature/your-feature-name`
5. **创建Pull Request**: 在GitHub上创建PR

### 代码规范
- 遵循PEP 8 Python代码规范
- 使用有意义的变量和函数名
- 添加适当的注释和文档字符串
- 编写单元测试覆盖新功能
- 确保所有测试通过

### 提交信息规范
```
type(scope): description

[optional body]

[optional footer]
```

类型说明：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 问题报告
如果您发现bug或有功能建议，请：
1. 检查是否已有相关issue
2. 使用issue模板创建新issue
3. 提供详细的复现步骤和环境信息
4. 如果可能，提供修复建议

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

感谢以下开源项目和服务：
- [Flask](https://flask.palletsprojects.com/) - Web框架
- [Chart.js](https://www.chartjs.org/) - 图表库
- [MySQL](https://www.mysql.com/) - 数据库
- [Redis](https://redis.io/) - 缓存系统
- [Docker](https://www.docker.com/) - 容器化平台
- [CoinDesk API](https://www.coindesk.com/api) - 价格数据源

---

## 📞 联系我们

- **项目主页**: https://github.com/your-username/crypto-monitoring-plus
- **问题反馈**: https://github.com/your-username/crypto-monitoring-plus/issues
- **邮箱**: your-email@example.com
- **文档**: https://crypto-monitoring-plus.readthedocs.io

---

<div align="center">
  <p>如果这个项目对您有帮助，请给我们一个 ⭐️</p>
  <p>Made with ❤️ by the Crypto Monitoring Plus Team</p>
</div>