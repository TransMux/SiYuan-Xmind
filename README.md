<h1 align="center">Note Map</h1>

<h6 align="center">Current Version: v1.1</h6>

✨ 一键导出当前目录下所有大纲并组合为思维导图

支持在思源内预览思维导图，也支持导出为`.xmind`格式(需要用**Xmind**打开哦~)

可以用于复习时，对着大纲回想笔记内容~

## 效果图

感谢九炎大佬贡献的思源内思维导图预览功能~！

![image.png](https://b3logfile.com/siyuan/1613565605390/assets/image-20220410002755-whmqqxo.png)

![image.png](https://b3logfile.com/siyuan/1613565605390/assets/image-20220410002237-zr7sb1a.png)

## 食用方法

1. 引入挂件

2. 点击按钮

3. 完成！

### 手动构建

仓库有两个分支：

1. `master` 源代码，开发工作在这个分支上完成，通过action构建到`main`以减小挂件体积

2. `main` 构建分支 (因为挂件集市索引图片默认是main分支)

如果需要手动构建，请切换到`master`分支后：

```
pnpm i
pnpm build
```
