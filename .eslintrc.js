/** @format */

module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
	parserOptions: {
		parser: "babel-eslint",
	},
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? 1 : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? 1 : "off",
		"no-alert": 0, //禁止使用alert confirm prompt
		"vue/html-indent": [
			0,
			"tab",
			{
				baseIndent: 1,
			},
		],
		"no-const-assign": 2, //禁止修改const声明的变量
		"no-empty": 2, //块语句中的内容不能为空
		"no-eq-null": 1, //禁止对null使用==或!=运算符
		// "no-floating-decimal": 2,//禁止省略浮点数中的0 .5
		// "no-implicit-coercion": 1,//禁止隐式转换
		"no-multi-spaces": 1, //不能用多余的空格
		"no-nested-ternary": 0, //禁止使用嵌套的三目运算
		"no-param-reassign": 2, //禁止给参数重新赋值
		// "no-mixed-spaces-and-tabs": 2, //禁止混用tab和空格
		camelcase: 1, //强制驼峰法命名
		eqeqeq: 2, //必须使用全等
		indent: [0, "tab"], //缩进风格
		"key-spacing": [
			0,
			{
				beforeColon: false,
				afterColon: true,
			},
		], //对象字面量中冒号的前后空格
		"max-params": [0, 5], //函数最多只能有5个参数
		"no-unused-vars": [
			2,
			{
				// 允许声明未使用变量
				vars: "local",
				// 参数不检查
				args: "none",
			},
		],
		"no-undef": 1, //不能有未定义的变量
		"no-trailing-spaces": 1, //一行结束后面不要有空格
		"no-sparse-arrays": 2, //禁止稀疏数组， [1,,2]
		"no-redeclare": 2, //禁止重复声明变量
		"no-multiple-empty-lines": [1, {max: 2}], //空行最多不能超过2行
		"no-extra-semi": 2, //禁止多余的冒号
		"block-scoped-var": 2, //禁止块语句中使用var
		strict: 2, //使用严格模式
		"invalid-first-character-of-tag-name": 0, //三元运算符可以使用小于号
		"space-infix-ops": 2, // 要求操作符周围有空格
		"no-var": 2, // 要求使用 let 或 const 而不是 var
	},
};
