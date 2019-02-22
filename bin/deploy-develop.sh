#!/usr/bin/env bash

echo "编译开始..."

yarn run dev-build

echo "编译完成..."

echo "复制文件到远程服务器..."

scp -r dist/* root@47.96.7.128:/work/html/marry-bops

echo "发布完成..."
