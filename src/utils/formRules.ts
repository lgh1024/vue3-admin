export const loginFormRules = {
  username: [
    {required: true, message: '请输入账号', trigger: 'blur'},
    {min: 4, max: 12, message: '账号要在4-12个数字之间', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 12, message: '密码要在6-12个数字之间', trigger: 'blur'}
  ]
}

export const userFormRules = {
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {min: 10, max: 30, message: '请输入正确的邮箱', trigger: 'blur'},
    {
      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
      message: '请输入正确的邮箱',
      trigger: 'blur'
    }
  ],
    mobile: [
  {required: true, message: '请输入手机号码', trigger: 'blur'},
  {min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur'},
  {
    pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
    message: '请输入正确的手机号码',
    trigger: 'blur'
  }
]
}

export const addUserFormRules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 10, message: '用户名必须在3到10位之间', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 5, max: 10, message: '密码必须在5到10位之间', trigger: 'blur'}
  ],
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {min: 10, max: 30, message: '请输入正确的邮箱', trigger: 'blur'},
    {
      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
      message: '请输入正确的邮箱'
    }
  ],
  mobile: [
    {required: true, message: '请输入手机号码', trigger: 'blur'},
    {min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur'},
    {
      pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
      message: '请输入正确的手机号码'
    }
  ]
}

export const addGoodsFormRules = {
  goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
  goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }]
}