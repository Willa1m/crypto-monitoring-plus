# 使用Python 3.9作为基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    curl \
    build-essential \
    wget \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# 下载并安装TA-Lib C库（0.4.0，TA-Lib的C核心库版本）
RUN wget http://prdownloads.sourceforge.net/ta-lib/ta-lib-0.4.0-src.tar.gz && \
    tar -xvzf ta-lib-0.4.0-src.tar.gz && \
    cd ta-lib && \
    ./configure --prefix=/usr && \
    make && \
    make install && \
    cd .. && \
    rm -rf ta-lib ta-lib-0.4.0-src.tar.gz

# 设置TA-Lib环境变量
ENV TA_LIBRARY_PATH=/usr/lib
ENV TA_INCLUDE_PATH=/usr/include

# 复制requirements.txt并安装Python依赖
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY ./backend .

# 复制项目根目录的templates和static目录
COPY ../templates ./templates
COPY ../static ./static

# 创建必要的目录
RUN mkdir -p data/kline_data logs

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# 启动命令 - 同时启动Web应用和调度器
CMD ["sh", "-c", "python scheduler.py & python crypto_web_app.py"]