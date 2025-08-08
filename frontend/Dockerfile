# 使用Nginx作为基础镜像
FROM nginx:alpine

# 复制HTML文件
COPY index.html /usr/share/nginx/html/

# 复制静态文件，保持/static/路径结构
COPY static/ /usr/share/nginx/html/static/

# 复制templates目录
COPY templates/ /usr/share/nginx/html/templates/

# 复制Nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]