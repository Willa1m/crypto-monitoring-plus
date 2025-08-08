#!/usr/bin/env python3
"""
加密货币监控系统 - 定时任务调度器
专门用于运行定时任务，独立于Web服务器
"""

import logging
import time
import schedule
from datetime import datetime
import sys
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 导入各个模块
from data_processor import run_data_processing
from crypto_analyzer import run_analysis
from realtime_processor import run_realtime_processor

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scheduler.log'),
        logging.StreamHandler()
    ]
)

class CryptoScheduler:
    def __init__(self):
        self.is_running = False
    
    def setup_schedule(self):
        """设置定时任务"""
        logging.info("设置定时任务")
        
        # 每5分钟运行一次数据收集
        schedule.every(5).minutes.do(self.run_data_collection_task)
        
        # 每30秒运行一次实时数据处理
        schedule.every(30).seconds.do(self.run_realtime_task)
        
        # 每小时运行一次分析
        schedule.every().hour.do(self.run_analysis_task)
        
        # 每天凌晨2点运行完整处理
        schedule.every().day.at("02:00").do(self.run_full_processing)
        
        logging.info("定时任务设置完成")
        logging.info("- 数据收集: 每5分钟")
        logging.info("- 实时处理: 每30秒")
        logging.info("- 分析任务: 每小时")
        logging.info("- 完整处理: 每天凌晨2点")
    
    def run_realtime_task(self):
        """运行实时数据处理任务"""
        logging.info("执行实时数据处理任务")
        try:
            if run_realtime_processor():
                logging.info("实时数据处理任务完成")
            else:
                logging.error("实时数据处理任务失败")
        except Exception as e:
            logging.error(f"实时数据处理任务异常: {str(e)}")
    
    def run_data_collection_task(self):
        """运行数据收集任务"""
        logging.info("执行定时数据收集任务")
        try:
            if run_data_processing():
                logging.info("定时数据收集任务完成")
            else:
                logging.error("定时数据收集任务失败")
        except Exception as e:
            logging.error(f"定时数据收集任务异常: {str(e)}")
    
    def run_analysis_task(self):
        """运行分析任务"""
        logging.info("执行定时分析任务")
        try:
            if run_analysis():
                logging.info("定时分析任务完成")
            else:
                logging.error("定时分析任务失败")
        except Exception as e:
            logging.error(f"定时分析任务异常: {str(e)}")
    
    def run_full_processing(self):
        """运行完整处理流程"""
        logging.info("执行完整处理流程")
        try:
            # 数据处理
            if run_data_processing():
                logging.info("完整数据处理完成")
            else:
                logging.error("完整数据处理失败")
            
            # 分析报告
            if run_analysis():
                logging.info("完整分析报告生成完成")
            else:
                logging.error("完整分析报告生成失败")
                
        except Exception as e:
            logging.error(f"完整处理流程异常: {str(e)}")
    
    def run(self):
        """运行调度器"""
        logging.info("🚀 启动加密货币监控系统调度器")
        
        # 设置定时任务
        self.setup_schedule()
        
        # 立即运行一次数据收集
        logging.info("执行初始数据收集...")
        self.run_data_collection_task()
        
        self.is_running = True
        logging.info("📊 调度器开始运行...")
        
        while self.is_running:
            try:
                schedule.run_pending()
                time.sleep(10)  # 每10秒检查一次
            except KeyboardInterrupt:
                logging.info("收到中断信号，正在停止调度器...")
                self.is_running = False
                break
            except Exception as e:
                logging.error(f"调度器运行异常: {str(e)}")
                time.sleep(60)  # 出错后等待1分钟再继续
        
        logging.info("🛑 调度器已停止")
    
    def stop(self):
        """停止调度器"""
        logging.info("正在停止调度器...")
        self.is_running = False

def main():
    """主函数"""
    scheduler = CryptoScheduler()
    
    try:
        scheduler.run()
    except KeyboardInterrupt:
        print("\n\n👋 调度器被用户中断，再见！")
    except Exception as e:
        logging.error(f"调度器运行异常: {str(e)}")
        print(f"❌ 调度器运行异常: {str(e)}")

if __name__ == "__main__":
    main()