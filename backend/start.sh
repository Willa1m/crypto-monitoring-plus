#!/bin/bash

# 启动脚本 - 同时运行Web应用和调度器

echo "🚀 启动加密货币监控系统"
echo "================================"

# 启动调度器（后台运行）
echo "📊 启动数据收集调度器..."
python scheduler.py &
SCHEDULER_PID=$!

# 等待2秒让调度器初始化
sleep 2

# 启动Web应用（前台运行）
echo "🌐 启动Web应用服务器..."
python crypto_web_app.py &
WEB_PID=$!

# 等待任一进程退出
wait $WEB_PID $SCHEDULER_PID

echo "🛑 系统已停止"