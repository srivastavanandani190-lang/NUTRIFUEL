# Food Recommendation Dashboard 需求文档

## 1. 应用概述

### 1.1 应用名称
Food Recommendation Dashboard

### 1.2 应用描述
一款生产级 React 食品推荐仪表板，提供全面的食品探索、完整的每周膳食计划（周一至周日）、个性化运动推荐（集成瑜伽/健身）、每周运动追踪和作弊日卡路里消耗计算。应用采用现代化 UI 设计，使用 Tailwind CSS 和 Chart.js 可视化，需要基于电子邮件的身份验证以提供个性化用户体验，包含个人资料管理和搜索历史追踪。应用通过 Edamam API 集成实时营养数据，并包含智能运动与膳食同步功能以及专业的每周膳食准备系统。新增一键购买功能，集成 Zepto、Blinkit、Flipkart Minutes 三大平台，实现食材采购与外卖订餐的无缝对接，采用智能价格估算系统和深度链接技术。新增位置追踪功能，根据用户所在位置实时显示食品可用性。新增位置选项功能，允许用户手动设置或自动检测配送城市，支持用户自定义添加任意位置。

## 2. 核心功能

### 2.1 首页（公开访问）
- BMI 计算器，包含输入字段：
  - 当前体重（kg）
  - 身高（cm）
  - 目标体重（kg）
  - 活动水平下拉菜单
- 计算按钮显示：
  - BMI 结果
  - 每日卡路里目标（BMR × 活动系数 - 体重赤字）
  - 3 张示例食品卡片
- 操作按钮：
  - 免费注册
  - 登录

### 2.2 身份验证系统（仅电子邮件）
**注册表单：**
- 电子邮件（必填）
- 用户名（必填）
- 密码（必填）
- 确认密码（必填）
- 创建账户按钮

**登录表单：**
- 电子邮件或用户名输入
- 密码输入
- 登录按钮
- 忘记密码链接

**成功状态：**
- 重定向到仪表板，显示欢迎，[用户名]！消息
- 显示励志名言，每次登录/注册时刷新

**重要说明：** 不使用 Google 身份验证，仅使用电子邮件 + 用户名 + 密码。

### 2.3 励志名言功能
- 在成功登录或注册时显示随机励志名言
- 每次用户登录或注册时刷新名言
- 名言显示位置：仪表板欢迎区域
- 名言示例：
  - Your body is a reflection of your lifestyle
  - Small progress is still progress
  - Take care of your body. It's the only place you have to live
  - Eat well, live well, be well
  - Health is wealth
  - You are what you eat
  - Nourish your body, fuel your dreams
  - Every meal is a chance to nourish yourself
  - Strong body, strong mind
  - Your health journey starts with a single step

### 2.4 导航结构
- 顶部居中导航，使用翡翠绿→绿色渐变按钮
- 七个主要标签页：
  - 🍽️ Food Explorer
  - 🗓️ Weekly Meal Planner
  - 🧘 Yoga Suggestions
  - 📈 Weekly Chart
  - 🍰 Cheat Day Burn
  - 💪 Exercise
  - 👤 Profile

### 2.5 Food Explorer 标签页（实时 EDAMAM API 集成 + 真实食品图片系统 + 智能价格估算购买功能 + 位置追踪食品可用性）

**Edamam API 配置：**
- API 端点：https://api.edamam.com/api/nutrition-data
- App ID：9b2a2b8e
- App Key：1b3e6f8a8f8b9c0d1e2f3a4b5c6d7e8f
- 请求格式：`https://api.edamam.com/api/nutrition-data?app_id=9b2a2b8e&app_key=1b3e6f8a8f8b9c0d1e2f3a4b5c6d7e8f&ingr=100g%20[food-name]`

**食品图片系统（三级回退机制）：**

**Level 1 - Foodish API（随机真实食品照片）：**
- API 端点：https://foodish-api.com/api/images/[category]/[random]
- 支持分类：biryani、burger、dessert、dosa、fries、pizza、random 等
- 示例：
  - biryani → https://foodish-api.com/images/biryani/biryani32.jpg
  - burger → https://foodish-api.com/images/burger/burger101.jpg
  - dessert → https://foodish-api.com/images/dessert/dessert14.jpg

**Level 2 - Unsplash Source（关键词特定图片）：**
- API 端点：https://source.unsplash.com/300x250/?[food]
- 示例：
  - paneer → 真实印度 paneer 菜肴
  - chicken curry → 正宗鸡肉照片
  - dal → 扁豆咖喱图片
  - apple、banana、salad、roti 等

**Level 3 - 硬编码映射（200+ 精确匹配）：**
```javascript
const foodImages = {
  \"Paneer\": \"https://foodish-api.com/images/dosa/dosa45.jpg\",
  \"Chicken Breast\": \"https://source.unsplash.com/300x250/?grilled chicken\",
  \"Dal\": \"https://source.unsplash.com/300x250/?dal\",
  \"Roti\": \"https://source.unsplash.com/300x250/?roti\",
  \"Apple\": \"https://source.unsplash.com/300x250/?apple\",
  \"Egg\": \"https://foodish-api.com/images/burger/burger101.jpg\"
  // ... +195 个精确匹配
};
```

**图片渲染逻辑（食品卡片）：**
```javascript
const getImage = (food) => {
  // Level 1: 硬编码映射
  if (foodImages[food.name]) return foodImages[food.name];
  
  // Level 2: Unsplash
  if (food.category === 'Indian') 
    return `https://source.unsplash.com/300x250/?${food.name}`;
  
  // Level 3: Foodish 随机
  return `https://foodish-api.com/images/random/random${Math.floor(Math.random()*100)}.jpg`;
};
```

**分类图片（Explorer 标签）：**
- Fruits：https://source.unsplash.com/300x200/?fruits
- Veggies：https://source.unsplash.com/300x200/?vegetables
- Veg：https://source.unsplash.com/300x200/?indian vegetarian
- Non-Veg：https://source.unsplash.com/300x200/?grilled meat
- Snacks：https://foodish-api.com/images/fries/fries23.jpg
- Desserts：https://foodish-api.com/images/dessert/dessert14.jpg
- Dairy：https://source.unsplash.com/300x200/?dairy products
- Grains：https://source.unsplash.com/300x200/?grains

**响应式图片尺寸：**
- 移动端：h-40 w-full（紧凑）
- 平板端：h-48 w-full
- 桌面端：h-56 w-full（宽敞）
- 懒加载 + 模糊占位符

**图片错误处理：**
1. 主 API 失败 → 回退到 Unsplash
2. Unsplash 失败 → Foodish 随机
3. 全部失败 → 美观的渐变占位符：
```jsx
<div className=\"bg-gradient-to-br from-emerald-400 to-blue-500 h-56 flex items-center justify-center\">
  <span className=\"text-6xl\">🍲</span>
  <p className=\"text-white font-bold\">{food.name}</p>
</div>
```

**性能优化：**
- 预加载 12 个热门图片
- localStorage 缓存（24 小时）
- WebP 自动格式化
- Blurhash 占位符

**移动端增强功能：**
- 触摸缩放图片
- 滑动画廊（每个食品 3 个角度）
- 保存图片按钮

**热门食品列表（50 个预填充项目，便于快速访问）：**
```javascript
const popularFoods = [
  {name: \"Paneer Tikka\", image: \"https://source.unsplash.com/300x250/?paneer tikka\"},
  {name: \"Chicken Curry\", image: \"https://source.unsplash.com/300x250/?chicken curry\"},
  {name: \"Dal Tadka\", image: \"https://source.unsplash.com/300x250/?dal\"},
  {name: \"Apple\", image: \"https://foodish-api.com/images/apple/apple1.jpg\"},
  // ... 所有分类的精确图片
];
```

- **水果**：Apple、Banana、Orange、Mango、Grapes、Strawberry、Watermelon、Pineapple、Kiwi、Papaya
- **蔬菜**：Spinach、Broccoli、Carrot、Tomato、Cucumber、Bell Pepper、Cauliflower、Cabbage、Lettuce、Onion
- **素食**：Paneer、Dal、Roti、Rice、Curd、Rajma、Chana、Aloo Gobi、Palak Paneer、Idli
- **非素食**：Chicken Breast、Egg、Fish、Mutton、Prawns、Salmon、Tuna、Turkey、Chicken Thigh、Pork
- **零食**：Almonds、Chips、Yogurt、Popcorn、Nuts、Crackers、Granola Bar、Peanuts、Cashews、Walnuts
- **甜点**：Ice Cream、Gulab Jamun、Cake、Brownie、Cookies、Kheer、Jalebi、Chocolate、Pastry、Donut
- **乳制品**：Milk、Cheese、Butter、Ghee、Paneer、Cream、Yogurt、Buttermilk、Condensed Milk、Whey
- **谷物**：Oats、Rice、Bread、Pasta、Quinoa、Wheat、Barley、Couscous、Bulgur、Millet

**搜索栏（顶部 - 全宽）：**
- 单个输入字段：Search for any food: chicken, apple, pasta, paneer...
- 用户输入时触发实时 Edamam API 调用
- API 请求期间显示加载旋转器
- 玻璃拟态设计，带搜索图标和麦克风按钮
- 搜索结果显示：Found X [food name] dishes
- 显示绿色 ✅ Live Nutrition Data 徽章
- Powered by Edamam API 页脚

**筛选面板（桌面端左侧边栏，移动端底部抽屉）：**
- 卡路里：滑块 0-1000kcal
- 蛋白质：滑块 0-100g
- 碳水化合物：滑块 0-150g
- 脂肪：滑块 0-80g
- 类别复选框：
  - [ ] Vegetarian
  - [ ] Non-Veg
  - [ ] Fruits
  - [ ] Veggies
  - [ ] Snacks
  - [ ] Desserts
- 排序选项：
  - Newest
  - Calories Low-High
  - Protein High-Low
- Clear All 按钮
- 筛选标签，翡翠绿激活状态，灰色非激活状态
- 移动端：筛选抽屉从底部滑出

**类别标签页（网格上方 8 个固定标签）：**
1. 🍎 FRUITS
2. 🥬 VEGGIES
3. 🥗 VEGETARIAN
4. 🍗 NON-VEG
5. 🥜 SNACKS
6. 🍰 DESSERTS
7. 🥛 DAIRY
8. 🌾 GRAINS
- 移动端可滑动类别
- 每个类别触发预填充的实时 Edamam 搜索
- 每个类别标签显示对应的真实食品图片缩略图
- 类别图片每 5 秒轮播切换（轮播效果）

**食品网格（主区域 - 响应式）：**
- 布局：桌面端 3 列，平板端 2 列，移动端 1 列
- 每张食品卡片显示：
  - 食品图片（通过三级回退系统获取真实照片，圆角设计）
  - 食品名称（粗体，大文本）
  - 份量（每 100g）
  - 来自实时 Edamam API 的营养信息框：
    - 🔥 [calories] kcal
    - 💪 [protein]g PROTEIN ([%] daily value) | 🍠 [carbs]g CARBS ([%] daily value) | 🥑 [fat]g FAT ([%] daily value)
  - View Full Nutrition Facts 按钮（展开显示完整面板）
  - **位置追踪食品可用性显示（营养信息下方）：**
    - **📍 AVAILABILITY（食品可用性）：**
      - 显示格式：Available in your area
      - 实时检测用户位置（Geolocation API）
      - 根据用户位置显示食品可用性状态：
        - ✅ In Stock（库存充足）- 绿色徽章
        - ⚠️ Limited Stock（库存有限）- 黄色徽章
        - ❌ Out of Stock（缺货）- 红色徽章
      - 显示最近补货时间：Last restocked 2 hours ago
      - 显示附近商店数量：Available at 3 nearby stores
      - 点击查看详细信息：View Store Details 按钮
  - **智能价格估算购买区域（可用性信息下方）：**
    - **🛒 BUY FROM（购买平台）：**
      - 显示格式：Available on 3 platforms
      - [⚡ Blinkit: ₹110-120 [10min] 🏆] [🛒 Zepto: ₹115-125 [18min]] [🛍️ Flipkart Minutes: ₹120-130 [15min]] 按钮
      - 价格范围基于用户当前位置的市场数据智能估算
      - 深度链接直接打开对应平台应用
      - 仅显示用户所在位置可用的购买平台
      - 每个平台按钮显示：
        - 平台 Logo（SVG 图标）
        - 价格范围（₹110-120）
        - 配送时间（[10min]）
        - 库存状态（✅ In Stock / ⚠️ Limited / ❌ Out）
        - 最优选择徽章（🏆 Blinkit 最快配送）
  - Add to Planner 按钮（绿色脉冲动画）
- 卡片样式：shadow-2xl、hover:scale-105、渐变边框
- 悬停效果：快速营养预览弹窗
- 点击 View Full Nutrition Facts 显示完整营养成分面板，包含来自 Edamam API 的所有宏量营养素和微量营养素
- 营养显示：颜色编码（绿色蛋白质，橙色碳水化合物，黄色脂肪）
- 无限滚动，带 Load More（每次加载 20 个食品：20→40→60...）
- 无结果状态：Try Paneer, Chicken, or Apple + 建议
- 页面加载时立即从热门食品列表加载食品
- API 请求期间显示加载骨架卡片

**位置追踪食品可用性系统：**
```javascript
const foodAvailability = {
  \"Paneer 200g\": {
    patna: { status: \"in_stock\", stores: 5, lastRestock: \"2 hours ago\" },
    delhi: { status: \"in_stock\", stores: 12, lastRestock: \"1 hour ago\" },
    mumbai: { status: \"limited\", stores: 3, lastRestock: \"5 hours ago\" },
    bangalore: { status: \"in_stock\", stores: 8, lastRestock: \"30 mins ago\" },
    custom: { status: \"unknown\", stores: 0, lastRestock: \"N/A\" }
  },
  \"Apple 1kg\": {
    patna: { status: \"in_stock\", stores: 8, lastRestock: \"1 hour ago\" },
    delhi: { status: \"in_stock\", stores: 15, lastRestock: \"30 mins ago\" },
    mumbai: { status: \"in_stock\", stores: 10, lastRestock: \"2 hours ago\" },
    bangalore: { status: \"limited\", stores: 4, lastRestock: \"6 hours ago\" },
    custom: { status: \"unknown\", stores: 0, lastRestock: \"N/A\" }
  },
  \"Chicken 500g\": {
    patna: { status: \"limited\", stores: 3, lastRestock: \"4 hours ago\" },
    delhi: { status: \"in_stock\", stores: 10, lastRestock: \"1 hour ago\" },
    mumbai: { status: \"in_stock\", stores: 12, lastRestock: \"2 hours ago\" },
    bangalore: { status: \"out_of_stock\", stores: 0, lastRestock: \"12 hours ago\" },
    custom: { status: \"unknown\", stores: 0, lastRestock: \"N/A\" }
  }
  // ... 200+ 食品的位置可用性数据
};
```

**位置感知可用性检测逻辑：**
```javascript
const checkAvailability = (foodName, userLocation) => {
  const { city } = userLocation;
  const cityKey = city.toLowerCase();
  const availability = foodAvailability[foodName]?.[cityKey] || 
                      foodAvailability[foodName]?.custom || {
    status: \"unknown\",
    stores: 0,
    lastRestock: \"N/A\"
  };
  
  return {
    status: availability.status,
    badge: getStatusBadge(availability.status),
    stores: availability.stores,
    lastRestock: availability.lastRestock,
    message: getAvailabilityMessage(availability.status)
  };
};

const getStatusBadge = (status) => {
  switch(status) {
    case \"in_stock\": return \"✅ In Stock\";
    case \"limited\": return \"⚠️ Limited Stock\";
    case \"out_of_stock\": return \"❌ Out of Stock\";
    default: return \"❓ Unknown\";
  }
};

const getAvailabilityMessage = (status) => {
  switch(status) {
    case \"in_stock\": return \"Available in your area\";
    case \"limited\": return \"Hurry! Limited stock available\";
    case \"out_of_stock\": return \"Currently unavailable in your area\";
    default: return \"Availability unknown for this location\";
  }
};
```

**商店详情模态框（点击 View Store Details）：**
```
Nearby Stores with Paneer:

1. Blinkit Store - Patna Main
   📍 Distance: 1.2 km
   ✅ In Stock (50+ units)
   🕒 Open until 11 PM
   [🛒 Order Now]

2. Zepto Hub - Boring Road
   📍 Distance: 2.5 km
   ✅ In Stock (30+ units)
   🕒 Open 24/7
   [🛒 Order Now]

3. Flipkart Minutes - Fraser Road
   📍 Distance: 3.8 km
   ⚠️ Limited Stock (5 units)
   🕒 Open until 10 PM
   [🛒 Order Now]
```

**智能价格估算数据库（位置感知）：**
```javascript
const priceDB = {
  \"Paneer 200g\": {
    patna: {
      zepto: \"₹115-125\",
      blinkit: \"₹110-120\",
      flipkart: \"₹120-130\",
      avg: 118
    },
    delhi: {
      zepto: \"₹125-135\",
      blinkit: \"₹120-130\",
      flipkart: \"₹130-140\",
      avg: 128
    },
    mumbai: {
      zepto: \"₹130-140\",
      blinkit: \"₹125-135\",
      flipkart: \"₹135-145\",
      avg: 133
    },
    bangalore: {
      zepto: \"₹120-130\",
      blinkit: \"₹115-125\",
      flipkart: \"₹125-135\",
      avg: 123
    },
    custom: {
      zepto: \"₹--\",
      blinkit: \"₹--\",
      flipkart: \"₹--\",
      avg: 0
    }
  },
  \"Apple 1kg\": {
    patna: {
      zepto: \"₹150-165\",
      blinkit: \"₹145-160\",
      flipkart: \"₹155-170\",
      avg: 155
    },
    delhi: {
      zepto: \"₹160-175\",
      blinkit: \"₹155-170\",
      flipkart: \"₹165-180\",
      avg: 165
    },
    mumbai: {
      zepto: \"₹170-185\",
      blinkit: \"₹165-180\",
      flipkart: \"₹175-190\",
      avg: 175
    },
    bangalore: {
      zepto: \"₹155-170\",
      blinkit: \"₹150-165\",
      flipkart: \"₹160-175\",
      avg: 160
    },
    custom: {
      zepto: \"₹--\",
      blinkit: \"₹--\",
      flipkart: \"₹--\",
      avg: 0
    }
  }
  // ... 200+ 食品的多城市价格数据
};
```

**购买按钮设计（玻璃拟态风格 + 深度链接 + 库存状态）：**
```jsx
const FoodBuyLinks = ({ foodName, category, userLocation }) => {
  const { city, lat, lng } = userLocation;
  const availability = checkAvailability(foodName, userLocation);
  const cityKey = city.toLowerCase();
  const prices = priceDB[foodName]?.[cityKey] || priceDB[foodName]?.custom || {
    zepto: \"₹--\",
    blinkit: \"₹--\",
    flipkart: \"₹--\",
    avg: 0
  };
  
  const links = {
    zepto: `https://www.zepto.com/search?q=${encodeURIComponent(foodName)}&lat=${lat}&lng=${lng}`,
    blinkit: `https://blinkit.com/search?q=${encodeURIComponent(foodName)}`,
    flipkart: `https://www.flipkart.com/search?q=${encodeURIComponent(foodName)}+minutes`
  };

  return (
    <div className=\"space-y-3 mt-4\">
      {/* 可用性状态 */}
      <div className=\"p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl\">
        <div className=\"flex items-center justify-between\">
          <span className=\"text-sm font-semibold\">📍 AVAILABILITY</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            availability.status === 'in_stock' ? 'bg-green-100 text-green-700' :
            availability.status === 'limited' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {availability.badge}
          </span>
        </div>
        <p className=\"text-xs text-gray-600 mt-1\">{availability.message}</p>
        <p className=\"text-xs text-gray-500 mt-1\">Available at {availability.stores} nearby stores</p>
        <p className=\"text-xs text-gray-400 mt-1\">Last restocked {availability.lastRestock}</p>
        <button className=\"text-xs text-emerald-600 font-semibold mt-2 hover:underline\">
          View Store Details →
        </button>
      </div>

      {/* 购买平台按钮 */}
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl\">
        <a href={links.blinkit}
           className=\"p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-center font-bold hover:scale-105 transition\">
          ⚡ Blinkit<br/>
          <span className=\"text-xs\">{prices.blinkit} [10min] 🏆</span><br/>
          <span className=\"text-xs\">{availability.status === 'in_stock' ? '✅ In Stock' : availability.status === 'limited' ? '⚠️ Limited' : '❌ Out'}</span>
        </a>
        <a href={links.zepto}
           className=\"p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-center font-bold hover:scale-105 transition\">
          🛒 Zepto<br/>
          <span className=\"text-xs\">{prices.zepto} [18min]</span><br/>
          <span className=\"text-xs\">{availability.status === 'in_stock' ? '✅ In Stock' : availability.status === 'limited' ? '⚠️ Limited' : '❌ Out'}</span>
        </a>
        <a href={links.flipkart}
           className=\"p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-center font-bold hover:scale-105 transition\">
          🛍️ Flipkart Minutes<br/>
          <span className=\"text-xs\">{prices.flipkart} [15min]</span><br/>
          <span className=\"text-xs\">{availability.status === 'in_stock' ? '✅ In Stock' : availability.status === 'limited' ? '⚠️ Limited' : '❌ Out'}</span>
        </a>
      </div>
    </div>
  );
};
```

**智能链接生成逻辑（深度链接优先 + 位置感知）：**
```javascript
const buyLinks = (foodName, category, userLocation) => {
  const { city, lat, lng } = userLocation;
  const availability = checkAvailability(foodName, userLocation);
  const cityKey = city.toLowerCase();
  const priceData = priceDB[foodName]?.[cityKey] || priceDB[foodName]?.custom || { 
    zepto: \"₹--\", 
    blinkit: \"₹--\", 
    flipkart: \"₹--\",
    avg: 0 
  };
  
  return {
    zepto: {
      url: `https://www.zepto.com/search?q=${encodeURIComponent(foodName)}&lat=${lat}&lng=${lng}`,
      price: priceData.zepto,
      time: \"18min\",
      availability: availability.status
    },
    blinkit: {
      url: `https://blinkit.com/search?q=${encodeURIComponent(foodName)}`,
      price: priceData.blinkit,
      time: \"10min\",
      badge: \"🏆\",
      availability: availability.status
    },
    flipkart: {
      url: `https://www.flipkart.com/search?q=${encodeURIComponent(foodName)}+minutes`,
      price: priceData.flipkart,
      time: \"15min\",
      availability: availability.status
    }
  };
};
```

**移动端弹窗（点击食品卡片）：**
```
Quick Buy:
- 📍 Availability: ✅ In Stock (5 nearby stores)
- 🛒 Available on: 
  ⚡ Blinkit ₹110-120 [10min] 🏆 ✅ | 🛒 Zepto ₹115-125 [18min] ✅ | 🛍️ Flipkart ₹120-130 [15min] ⚠️
```

**完整营养成分面板显示（实时 Edamam 数据）：**
当用户点击 View Full Nutrition Facts 时，显示模态框/展开卡片，包含：
- Serving Size：100g
- Calories：[value] kcal
- **宏量营养素：**
  - Total Fat：[value]g ([%] daily value)
  - Saturated Fat：[value]g ([%] daily value)
  - Trans Fat：[value]g
  - Cholesterol：[value]mg ([%] daily value)
  - Sodium：[value]mg ([%] daily value)
  - Total Carbohydrates：[value]g ([%] daily value)
  - Dietary Fiber：[value]g ([%] daily value)
  - Total Sugars：[value]g
  - Added Sugars：[value]g ([%] daily value)
  - Protein：[value]g ([%] daily value)
- **微量营养素：**
  - Vitamin D：[value]mcg ([%] daily value)
  - Calcium：[value]mg ([%] daily value)
  - Iron：[value]mg ([%] daily value)
  - Potassium：[value]mg ([%] daily value)
- Source：Edamam Nutrition Database

**搜索流程：**
1. 用户输入 Chicken → 触发实时 Edamam API 调用
2. 显示加载旋转器 → 显示营养结果 + 真实鸡肉照片 + 位置追踪可用性状态（✅ In Stock at 3 nearby stores）+ 智能价格估算购买按钮（Blinkit、Zepto、Flipkart Minutes，仅显示用户所在位置可用的平台）
3. 回退：如果 API 失败，使用本地模拟数据，显示 Using cached data 消息
4. 在 localStorage 中缓存结果（24 小时）
5. 所有搜索自动保存到用户的搜索历史

**错误处理：**
- API 失败 → 显示 Using cached data 消息（不显示离线警告）
- 网络慢 → 加载骨架卡片
- 无结果 → Try Paneer, Chicken, or Apple 消息
- 位置服务失败 → 使用默认位置（Patna）并提示用户手动设置
- 自定义位置无数据 → 显示 Availability unknown for this location 消息

**动态功能：**
- 搜索 Paneer → 实时 Edamam API 调用立即显示营养数据 + 真实 paneer tikka 照片 + 位置追踪可用性（✅ In Stock at 5 stores in Patna）+ Blinkit ₹110-120 [10min] 🏆 ✅ / Zepto ₹115-125 [18min] ✅ / Flipkart Minutes ₹120-130 [15min] ✅ 购买按钮
- 筛选 Protein>20g + Veg → 仅显示来自缓存/实时数据的高蛋白素食 + 对应真实图片 + 位置感知价格估算购买链接
- 类别 Fruits + Sort Calories → 按卡路里排序的苹果/香蕉 + 新鲜水果照片 + 位置感知可用性 + Blinkit ₹145-160 / Zepto ₹150-165 / Flipkart ₹155-170 按钮
- 实时更新（筛选立即生效）
- 所有搜索自动保存到用户的搜索历史

**Firestore 收藏功能：**
- 保存 Paneer Tikka 图片 + 食谱 + 位置感知价格估算购买链接 到个人资料

**代码结构要求：**
- Edamam API 集成工具：utils/edamam.js
- 食品图片获取工具：utils/foodImages.js
- 智能价格估算工具：utils/priceEstimator.js
- 深度链接生成工具：utils/deepLinks.js
- 位置追踪工具：utils/locationTracker.js
- 食品可用性检测工具：utils/availabilityChecker.js
- 使用 useState 进行搜索/筛选状态管理
- 使用 useEffect 进行实时筛选
- 无限滚动实现
- 完整营养成分显示的模态框/可展开组件
- localStorage 缓存，24 小时数据持久化
- 带骨架卡片的加载状态
- API 失败的错误边界
- 图片懒加载组件
- 图片错误处理与回退逻辑
- 购买按钮动画组件（脉冲发光 + 悬停缩放）
- 深度链接处理组件（优先打开应用）
- 位置服务组件（Geolocation API）
- 可用性状态徽章组件
- 商店详情模态框组件

**用户流程：**
Food Explorer → 自动检测位置（Patna）或使用自定义位置 → 搜索 Paneer Tikka → 实时 Edamam API 调用 + 真实 paneer 照片加载 + 位置追踪可用性显示（✅ In Stock at 5 stores in Patna, Last restocked 2 hours ago 或 ❓ Unknown for custom location）+ 智能价格估算购买按钮显示（Blinkit ₹110-120 [10min] 🏆 ✅ / Zepto ₹115-125 [18min] ✅ / Flipkart Minutes ₹120-130 [15min] ✅ 或 ₹-- for custom location）→ 筛选 Protein>15g → 查看结果（所有食品显示真实照片 + 位置感知可用性 + 价格估算购买选项）→ 点击 View Store Details → 查看附近 3 家商店详情 → 点击 View Full Nutrition Facts → 查看来自 Edamam 的完整营养面板 → 点击 Blinkit 按钮 → 深度链接打开 Blinkit 应用，搜索 Paneer 200g，显示实时价格 ₹115 → 添加到购物车 → 保存到 Firestore shopping_cart，记录价格估算 ₹110-120 和可用性状态 ✅

### 2.6 Weekly Meal Planner 标签页（完整每周系统 + 智能价格估算购买集成 + 位置感知可用性）

**每周布局（7 个标签页水平滚动）：**
- Mon | Tue | Wed | Thu | Fri | Sat | Sun
- 移动端滑动导航
- 活动日期用翡翠绿渐变高亮显示
- 日历视图，每天使用玻璃拟态卡片

**每日膳食结构（每天）：**
- 🧇 BREAKFAST（400kcal）[2 个选项]
- 🍲 LUNCH（600kcal）[2 个选项]
- 🍗 DINNER（700kcal）[1 个主菜 + 剩菜]
- 🥜 SNACKS（200kcal x2）[下午 + 晚上]
- 📊 TOTAL：2200kcal ✓

**主题之夜（颜色编码）：**
- 🌱 Mon：MEATLESS（Paneer、Dal、Veggies）
- 🌮 Tue：TACO TUESDAY（Chicken/Mushroom tacos）
- 🍝 Thu：PASTA NIGHT（Veg Pesto/Arrabiata）
- 🍲 Fri：SOUP + SALAD
- 🍖 Sat：GRILL NIGHT
- 🧀 Sun：COMFORT FOOD

**营养分解（每天）：**
- ✅ 90g PROTEIN（1.2g/kg 体重）
- ✅ 250g CARBS（复合碳水：燕麦、米饭、红薯）
- ✅ 65g FAT（健康脂肪：坚果、牛油果、酥油）
- ✅ 30g FIBER（蔬菜、水果、豆类）
- 每个宏量营养素的颜色编码进度环

**运动同步集成：**
- 显示格式：Burn 770kcal today → Eat 2230kcal Smart
- 显示调整后的卡路里目标：基础卡路里 + 运动消耗
- 每周计划根据 Yoga Suggestions 标签页的运动卡路里自动调整
- 膳食标签：Post-Yoga Protein、Pre-Workout Carbs（当运动同步激活时）

**分类购物清单（自动生成 + 智能价格估算一键购买集成 + 位置感知可用性）：**
- 📍 PRODUCE（14 项）：Spinach、Broccoli、Tomatoes、Onions...
- 🧀 DAIRY（6 项）：Paneer、Yogurt、Milk、Eggs...
- 🥩 PROTEIN（5 项）：Chicken Breast、Fish、Dal...
- 🌾 GRAINS（4 项）：Rice、Oats、Roti atta、Pasta...
- 🥜 SNACKS（3 项）：Almonds、Protein bar、Apple...
- 可折叠部分，带颜色编码的商店类别
- 数量计算器：Chicken：1.2kg（6 餐）
- **位置感知可用性状态：**
  - 每个食材显示可用性徽章：✅ In Stock / ⚠️ Limited / ❌ Out / ❓ Unknown
  - 显示附近商店数量：Available at X stores
  - 显示最近补货时间：Last restocked X hours ago
- **智能价格估算总计（基于用户位置）：**
  - Blinkit Total: ₹1780 [10min avg] 🏆 ✅ 28/28 items available
  - Zepto Total: ₹1820 [18min avg] ✅ 28/28 items available
  - Flipkart Total: ₹1850 [15min avg] ⚠️ 25/28 items available
  - 自定义位置显示：Price unavailable for custom location
- **一键购买功能：**
  - [⚡ BLINKIT CART ₹1780 🏆 ✅] 按钮（深度链接）
  - [🛒 ZEPTO CART ₹1820 ✅] 按钮（深度链接）
  - [🛍️ FLIPKART CART ₹1850 ⚠️] 按钮（深度链接）
  - 点击后将所有 28 种食材添加到对应平台购物车
  - 显示文本：1-click checkout all 28 ingredients
  - 仅显示用户所在位置可用的平台
  - 显示每个平台的库存状态
  - 深度链接优先打开应用，回退到网页
- Add to Cart → 手机剪贴板
- 一键生成购物清单

**库存检查（复选框）：**
- ✅ PANTRY：Rice [3kg]、Dal [2kg]、Oats [1kg]
- ✅ FRIDGE：Paneer [500g]、Yogurt [1L]、Veggies
- ✅ FREEZER：Chicken [1kg]、Frozen peas

**准备笔记（周日计划）：**
- Sun 4PM → CHOP：Onion、Tomato、Garlic（3 天）
- Sun 5PM → COOK：Dal batch（4 份）
- Mon AM → BOIL：Eggs、Oats prep
- Wed PM → Taco filling（使用剩余鸡肉）
- 批量烹饪时间表，带时间段

**均衡营养引擎：**
- **早餐**：蛋白质 + 复合碳水（Eggs+Oats、Paneer Paratha）
- **午餐**：蛋白质 + 纤维 + 碳水（Chicken rice+veggies）
- **晚餐**：蛋白质 + 健康脂肪（Grilled fish + salad）
- **零食**：坚果 + 水果（Almonds + Apple）

**灵活性功能：**
- EAT OUT 插槽（切换天数）
- USE LEFTOVER 复选框
- 饮食筛选：[ ] Vegetarian [ ] Low-Carb [ ] High-Protein
- 在天数之间交换膳食（拖放）
- 移动端长按 → 与其他天交换

**膳食卡片显示（含智能价格估算购买按钮 + 位置感知可用性）：**
- 膳食名称，带颜色编码图标（早餐=橙色，午餐=蓝色，晚餐=绿色，零食=黄色）
- 食品列表，包含来自 Edamam API 的完整营养成分
- 总卡路里，带进度条
- 食谱指针，显示如何烹饪每道菜
- 基于运动类型的膳食标签
- **每餐的位置感知可用性状态：**
  - 📍 All ingredients available in your area
  - ✅ 5/5 items in stock
  - ⚠️ 1 item limited stock
  - ❓ Availability unknown for custom location
- **每餐的智能价格估算购买按钮：**
  - 🛒 Buy Ingredients（Blinkit ₹-- ✅ / Zepto ₹-- ✅ / Flipkart ₹-- ⚠️）
  - 自定义位置显示：Price unavailable
- 每餐的 Add to tracker 按钮

**周一示例显示：**
- 🧇 BREAKFAST：Oats + Almonds（400kcal）
  - 📍 ✅ All items available at 8 nearby stores
  - [⚡ Blinkit: ₹90-100 [10min] 🏆 ✅] [🛒 Zepto: ₹95-105 [18min] ✅] [🛍️ Flipkart: ₹100-110 [15min] ✅] 购买燕麦 + 杏仁
- 🍲 LUNCH：Dal + Roti + Cucumber（600kcal）
  - 📍 ✅ All items available at 5 nearby stores
  - [⚡ Blinkit: ₹80-90 [10min] 🏆 ✅] [🛒 Zepto: ₹85-95 [18min] ✅] [🛍️ Flipkart: ₹90-100 [15min] ✅] 购买 Dal + 面粉
- 🍗 DINNER：Paneer bhurji + Veggies（700kcal）
  - 📍 ✅ All items available at 5 nearby stores
  - [⚡ Blinkit: ₹110-120 [10min] 🏆 ✅] [🛒 Zepto: ₹115-125 [18min] ✅] [🛍️ Flipkart: ₹120-130 [15min] ✅] 购买食材
- 🥜 SNACKS：Apple + 15 Almonds（200kcal）
  - 📍 ✅ All items available at 8 nearby stores
  - [⚡ Blinkit: ₹145-160 [10min] 🏆 ✅] [🛒 Zepto: ₹150-165 [18min] ✅] [🛍️ Flipkart: ₹155-170 [15min] ✅] 购买水果 + 坚果
- 📊 TOTAL：1900kcal | P:85g C:220g F:55g
- GROCERY：Paneer 500g、Dal 500g、Oats 500g...
  - 📍 Availability: ✅ 28/28 items in stock in Patna 或 ❓ Unknown for custom location
  - [⚡ BLINKIT CART ₹1780 🏆 ✅] 按钮
  - [🛒 ZEPTO CART ₹1820 ✅] 按钮
  - [🛍️ FLIPKART CART ₹1850 ✅] 按钮

**个人资料同步：**
- 体重：65kg → 1.8g/kg = 每日 117g 蛋白质
- 目标：55kg → 赤字膳食
- 性别：Female → PCOS 友好选项
- 位置：Patna, Bihar 或自定义位置 → 购买链接自动包含城市信息，价格估算基于市场数据（如有），可用性检测基于商店库存（如有）

**Generate Week Plan 按钮：**
- 创建完整的 7 天膳食计划，每道菜都有食谱指针
- 自动生成分类购物清单，带智能价格估算购买按钮和位置感知可用性
- 创建准备笔记时间表
- 保存到 Firestore

**Save Plan 按钮：**
- 将完整的每周计划存储在 Firestore 中
- 包括购物清单、准备笔记、智能价格估算购买链接和位置感知可用性数据

**Print/PDF 按钮：**
- 将每周计划导出为 PDF
- 包括所有膳食、购物清单、准备笔记、智能价格估算购买链接和位置感知可用性信息

**移动端功能：**
- 滑动天数（Mon→Sun）
- 点击膳食 → 营养弹窗 + 位置感知可用性 + 智能价格估算购买选项
- 长按 → 与其他天交换
- 固定到主屏幕（PWA）
- 日历视图，带全宽卡片

### 2.7 Yoga Suggestions 标签页（完全改版）

**英雄部分：**
- 显示个性化消耗目标：Burn 770kcal Today → Eat 2230kcal Smart
- 进度追踪器：3/5 workouts completed ✓
- Generate Full Day Plan 按钮 → 同步到 Weekly Meal Planner

**瑜伽/运动类别（标签页界面）：**
1. 🏃 CARDIO（Running、Jumping Jacks、Burpees、HIIT）
2. 💪 STRENGTH（Pushups、Squats、Planks、Lunges）
3. 🧘 YOGA（Surya Namaskar、Vrikshasana、Bhujangasana）
4. 👩 WOMEN ONLY（PCOS Yoga、Postpartum、Butt Workouts）
5. 👨 MEN ONLY（Abs 6-pack、Chest Builder、Arm Blast）
6. 👫 COUPLES（Partner Yoga、Dance Cardio）
7. 🎯 WEIGHT LOSS（Deficit focused：500kcal burn）
8. 💪 MUSCLE GAIN（High protein + heavy lifts）
- 移动端可滑动类别标签
- 翡翠绿激活状态，灰色非激活状态

**个性化运动引擎：**
- 来自 Profile 的输入：当前体重、目标体重、性别、活动水平
- 智能算法：
  - Deficit = (CurrentWeight - TargetWeight) × 7700kcal/week
  - Daily Burn Target = Deficit ÷ 7 + Exercise Modifier
  - 女性：+ Yoga/PCOS 重点
  - 男性：+ Strength/Abs 重点
  - 减重：Cardio 70% + Yoga 30%
  - 增肌：Strength 60% + Cardio 20% + Yoga 20%

**每日运动输出：**
Your Plan：Lose 10kg in 10 weeks
- 🏃 CARDIO：45min Running（450kcal）+ 15min Jump Rope（200kcal）
- 💪 STRENGTH：3x12 Squats + 3x15 Pushups + 2min Plank
- 🧘 YOGA：20min Surya Namaskar（120kcal）
- TOTAL BURN：770kcal → Eat 2230kcal today ✅

**视觉运动卡片：**
- 30 秒视频缩略图
- 运动名称（例如，Surya Namaskar）
- 🕒 Duration | 🔥 Calories | 👩/👨 Difficulty level
- 描述（例如，Full body fat burn + flexibility）
- 视频集成：
  - 每个姿势的 YouTube 嵌入链接
  - 免费瑜伽频道（Yoga with Adriene、FightMaster）
  - 力量动作的动画 GIF
- 移动端视频自动播放（静音）
- 一键计时器
- 语音教练切换选项

**运动网格（主区域 - 响应式）：**
- 布局：桌面端 3 列，平板端 2 列，移动端 1 列
- 卡片样式：shadow-2xl、hover:scale-105、渐变边框
- 移动端可滑动类别

**智能推荐：**
- 女性（55kg→48kg）：PCOS Yoga + Butt workouts + Light cardio
- 男性（80kg→70kg）：Abs 6-pack + Chest + Heavy squats
- 初学者：Yoga 60% + Walking 40%
- 高级：HIIT 40% + Strength 40% + Yoga 20%

**运动 → 食品集成：**
1. 用户访问 Yoga 标签页 → 获得 770kcal 消耗计划
2. Weekly Meal Planner 自动调整：2230kcal meals for your workout
3. 显示每天总计精确消耗调整后卡路里的膳食
4. 每餐：Perfect post-workout protein + carbs

### 2.8 Weekly Chart 标签页
- 条形图显示周一至周日运动消耗的卡路里
- 每天手动输入：
  - 运动类型选择
  - 持续时间（分钟）
- 自动计算平均每日消耗
- 根据运动显示调整后的膳食计划（例如，Burn 400kcal → eat 2400kcal today）
- 折线图叠加显示体重趋势预测
- Generate Week Plan 按钮，生成 7 天每日膳食建议，每道菜都有食谱指针

### 2.9 Cheat Day Burn Calculator 标签页
- 输入字段：作弊日摄入卡路里（默认 3500kcal）
- 运动类型下拉菜单，带卡路里消耗率：
  - Running：10kcal/min
  - Gym：8kcal/min
  - Cycling：7kcal/min
  - Walking：5kcal/min
  - Swimming：9kcal/min
- 持续时间滑块（15-180 分钟）
- 计算结果：Burn X kcal in Y minutes to balance cheat day
- 进度追踪器，带建议（例如，30min gym + 45min walk = balanced）

### 2.10 Exercise 标签页（交互式瑜伽健身房，带图片 + YOUTUBE 视频）

**保持主题**：翡翠绿-蓝色/浅色-深色模式，玻璃拟态

**瑜伽/运动交互**（点击 → 全屏模态框）：

**1. 运动卡片网格**（3 列响应式）：
[类别标签页]：Cardio | Strength | Yoga | Women | Men | Weight Loss

每张卡片：
```
[英雄图片 300x400 - 人物做姿势]
Surya Namaskar  
🕒 20 mins | 🔥 120kcal | 👩 Beginner | 💪 Full Body
[▶️ PLAY VIDEO] [⏱️ START TIMER] [⭐ FAVORITE]
```

**2. 点击运动 → 全屏模态框**：
顶部：姿势的大图片/GIF（Unsplash + Giphy）
中间：
```
📹 YOUTUBE 视频嵌入（自动播放静音）
Perfect Surya Namaskar Tutorial - Yoga With Adriene
```

**统计数据**：
- Duration：20 mins
- Calories：120kcal（your weight）
- Difficulty：Beginner ⭐⭐☆☆☆
- Muscles：Core、Legs、Arms

说明：
```
1. Stand tall, hands prayer position
2. Inhale → Arms up, arch back
3. Exhale → Forward fold...
```

**计时器**：30s per pose × 12 = 6min flow
[⏸️ PAUSE] [🔄 REPEAT] [✅ DONE]

**3. 图片来源**（真实瑜伽照片）：
瑜伽体式（Unsplash）：
```
https://source.unsplash.com/400x500/?surya-namaskar
https://source.unsplash.com/400x500/?tree-pose
https://source.unsplash.com/400x500/?plank
https://source.unsplash.com/400x500/?warrior-pose
```

力量/健身房：
```
https://source.unsplash.com/400x500/?pushup
https://source.unsplash.com/400x500/?squat
https://source.unsplash.com/400x500/?burpee
```

**4. YOUTUBE 链接**（经过验证的教程）：
```
Surya Namaskar：https://youtube.com/embed/abc123（Yoga With Adriene）
Tree Pose：https://youtube.com/embed/def456  
Plank：https://youtube.com/embed/ghi789
Pushups：https://youtube.com/embed/jkl012
```

**5. 运动数据库**（50+ 交互式）：
YOGA（20）：
```
Surya Namaskar、Vrikshasana、Bhujangasana、Trikonasana、Shavasana...
```

**CARDIO**（10）：
Burpees、Jumping Jacks、Mountain Climbers、High Knees...

STRENGTH（15）：
```
Pushups、Squats、Lunges、Plank、Deadlifts...
```

**WOMEN**（10）：
PCOS Yoga、Butt Lift、Postpartum Core...

MEN（10）：
```
6-Pack Abs、Chest Pump、Arm Blaster...
```

**6. 个性化**（来自 Profile）：
65kg Woman → Weight Loss：
```
Recommended：Surya Namaskar（120kcal）+ Plank（80kcal）+ Warrior Pose
```

**80kg Man → Muscle Gain**：
```
Pushups 3x15 + Squats 3x12 + Burpees 3x10
```

**7. 交互功能**：
```
- **计时器**：点击姿势 → 30s 倒计时 + 语音教练
- **进度**：3/12 poses complete → 进度条
- **收藏**：星标 → 保存到 Profile
- **分享**：Share my 600kcal Yoga flow
- **卡路里追踪器**：基于体重的实时消耗
```

**8. 模态框动画**：
- 从底部滑出（移动端）
- 缩放 + 淡入（桌面端）
- 背景模糊（玻璃拟态）
- 视频自动播放（静音）

**9. 移动端完美体验**：
```
- 全屏视频（横屏自动旋转）
- 滑动姿势（左→下一个体式）
- 触觉反馈（姿势完成）
- 语音命令（Next pose）
```

**10. FIRESTORE**：
```
users/{userId}/
├── workout_history（date、exercises、total_burn）
├── favorites（pose_ids）
└── daily_flows（custom sequences）
```

每日计划同步：
```
Yoga：600kcal burned → Eat 2200kcal meals ready ✓
```

**保持其他标签页**：Weekly Planner、Food Explorer、Profile 等。

**示例运动**：
点击 Surya Namaskar →
[女性做姿势的英雄照片]
[YouTube：Yoga With Adriene 教程]
计时器：20mins → 120kcal burned
✅ Add to Daily Workout

部署：视频即时加载，计时器完美运行，移动端无瑕疵。

**结果**：
🧘 Yoga Tab → 点击 Plank →
全屏模态框，带照片 + Adriene 视频 + 60s 计时器
✅ 120kcal burned → Eat 2100kcal today

图片：真实 Unsplash 瑜伽照片
视频：专业 YouTube 教程
交互式：计时器 + 进度 + 收藏

终极交互式健身体验！🧘‍♀️▶️⏱️

### 2.11 Profile 标签页
**个人资料卡片显示：**
- 用户名
- 电子邮件
- 当前体重
- 身高
- BMI
- **位置信息**：城市、纬度、经度（用于购买链接生成和食品可用性追踪）
- 欢迎消息：Welcome, [Username]!

**编辑个人资料部分：**
- 体重输入
- 身高输入
- 目标输入
- 活动水平下拉菜单
- **位置设置（新增）：**
  - **自动检测位置**：
    - 使用 Geolocation API 自动获取用户当前位置
    - 显示当前位置：📍 Current Location: Patna, Bihar
    - 显示位置精度：Accuracy: ±50m
    - [🔄 Refresh Location] 按钮，用于重新检测位置
    - [✅ Use Current Location] 按钮，确认使用当前位置
  - **手动设置位置**：
    - [📍 Set Delivery City] 按钮，打开位置设置模态框
    - 模态框包含：
      - **城市名称输入框（支持搜索和自定义输入）**：
        - 用户可输入任意城市名称
        - 实时搜索预设城市列表
        - 支持添加不在预设列表中的自定义城市
        - 输入框提示：Enter city name or select from list
      - **预设城市列表**：Patna、Delhi、Mumbai、Bangalore、Kolkata、Chennai、Hyderabad 等
      - 每个城市显示：城市名称、州/地区、图标
      - **自定义城市添加功能**：
        - 用户输入城市名称后，显示 [+ Add Custom City] 按钮
        - 点击后将自定义城市添加到用户的城市列表
        - 自定义城市保存到 Firestore users/{userId}/custom_cities
        - 自定义城市在城市列表中显示，带 🌍 Custom 标签
      - 选择城市后自动保存到 Firestore
    - 显示已设置的配送城市：📍 Delivery City: Patna, Bihar 或 📍 Delivery City: Custom City 🌍
  - **位置权限管理**：
    - 首次访问时请求位置权限
    - 权限被拒绝时显示手动设置选项
    - 权限被授予时自动检测位置
    - [⚙️ Manage Location Permissions] 链接
  - **位置更新提示**：
    - 当检测到用户位置变化时，显示提示：Location changed to Delhi. Update delivery city?
    - [✅ Update] [❌ Keep Patna] 按钮
  - **自定义位置说明**：
    - 当用户选择自定义城市时，显示提示：Custom location selected. Price and availability data may be limited.
    - 自定义位置使用默认价格和可用性数据（显示 ₹-- 和 ❓ Unknown）
- Update 按钮

**搜索历史部分：**
- 时间轴布局，带食品缩略图
- 显示格式：Feb 22 - 2000kcal：Paneer Tikka、Roti、Dal
- 点击任何历史项目以重新加载该确切搜索
- 所有过去的搜索，带日期、卡路里和食品
- 每个历史项目的 Delete 按钮，用于删除单个搜索记录
- Clear History 按钮，用于一次性删除所有搜索历史

**保存的计划部分：**
- 保存的每周膳食计划列表，带缩略图和日期
- 点击加载保存的计划

**购物车历史部分：**
- 显示用户的平台偏好：Zepto、Blinkit、Flipkart Minutes
- 最近添加到购物车的食品列表
- 每周购物总计统计（基于智能价格估算和用户位置）
- 显示格式：
  - Week of Feb 22: ₹1845 total (Patna) 或 Price unavailable (Custom City 🌍)
  - Blinkit: ₹1780 (28 items) 🏆 ✅ All available
  - Zepto: ₹1820 (28 items) ✅ All available
  - Flipkart: ₹1850 (28 items) ⚠️ 25/28 available

**位置追踪历史部分（新增）：**
- 显示用户的位置历史记录
- 显示格式：
  - Feb 28, 2026 09:30 AM - Patna, Bihar (25.5941, 85.1376)
  - Feb 27, 2026 02:15 PM - Delhi, NCR (28.6139, 77.2090)
  - Feb 26, 2026 06:45 PM - Custom City 🌍 (Custom Location)
  - Feb 26, 2026 06:45 PM - Mumbai, Maharashtra (19.0760, 72.8777)
- 每个位置记录显示：
  - 日期和时间
  - 城市名称（预设城市或自定义城市）
  - 经纬度坐标（自定义城市显示 Custom Location）
  - 该位置的食品可用性统计（自定义城市显示 Data unavailable）
  - 该位置的价格范围（自定义城市显示 Price unavailable）
- Clear Location History 按钮

**自定义城市管理部分（新增）：**
- 显示用户添加的所有自定义城市列表
- 每个自定义城市显示：
  - 城市名称 🌍
  - 添加日期
  - [🗑️ Delete] 按钮，用于删除自定义城市
- Clear All Custom Cities 按钮

**账户设置：**
- Logout 按钮

## 3. 技术要求

### 3.1 前端设计
- 渐变背景：emerald-50→blue-50
- 玻璃拟态卡片：bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl
- 悬停效果：hover:scale-105
- 导航按钮：翡翠绿→绿色渐变
- 个人资料部分：大头像圆圈，带翡翠绿强调色
- 真实食品图片系统（Foodish API + Unsplash + 硬编码映射）
- 营养图标
- 带颜色编码的进度条和圆圈
- 专业营养应用美学（MyFitnessPal + Verywell Fit + Safifood 风格）
- 使用 Tailwind CSS 的响应式设计
- 移动端：滑动标签页，全宽身份验证表单，筛选抽屉从底部滑出
- 完整营养成分面板显示的模态框/可展开组件
- 绿色 ✅ Live Nutrition Data 状态指示器
- Powered by Edamam API 页脚
- API 请求的加载骨架卡片
- 仪表板上的励志名言显示区域
- 运动内容的视频缩略图和嵌入式播放器
- 颜色编码的膳食类别（早餐=橙色，午餐=蓝色，晚餐=绿色，零食=黄色）
- 带玻璃拟态卡片的每周日历视图
- 可折叠的购物清单部分
- 打印/PDF 导出样式
- 运动卡片的英雄图片（300x400px）
- 全屏模态框，带视频嵌入和计时器
- 运动姿势的动画 GIF
- 移动端横屏视频自动旋转
- 图片懒加载与 Blurhash 占位符
- 美观的渐变占位符（当所有图片 API 失败时）
- 触摸缩放图片功能
- 滑动画廊（每个食品 3 个角度）
- **智能价格估算购买按钮设计**：
  - 玻璃拟态风格：bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl
  - 圆角设计：rounded-xl
  - 阴影效果：shadow-lg
  - 悬停动画：hover:scale-105 transition
  - 渐变背景：
    - Blinkit：from-purple-500 to-purple-600
    - Zepto：from-orange-500 to-orange-600
    - Flipkart Minutes：from-blue-500 to-blue-600
  - 价格范围显示：text-xs font-semibold
  - 配送时间显示：text-xs opacity-90
  - 最优选择徽章：🏆（Blinkit 10min）
  - 平台 Logo 小图标（SVG）
  - 响应式布局：移动端 1 列，平板端 2 列，桌面端 3 列
  - 自定义位置显示：Price unavailable（灰色文本）
- **位置感知可用性徽章设计**：
  - ✅ In Stock：bg-green-100 text-green-700
  - ⚠️ Limited Stock：bg-yellow-100 text-yellow-700
  - ❌ Out of Stock：bg-red-100 text-red-700
  - ❓ Unknown：bg-gray-100 text-gray-700（自定义位置）
  - 圆角徽章：rounded-full px-2 py-1
  - 小字体：text-xs font-semibold
- **商店详情模态框设计**：
  - 玻璃拟态背景：bg-white/90 backdrop-blur-xl
  - 商店列表卡片：shadow-md rounded-xl p-4
  - 距离显示：text-sm text-gray-600
  - 库存状态：颜色编码徽章
  - 营业时间：text-xs text-gray-500
  - Order Now 按钮：渐变背景 + 悬停效果
  - 自定义位置显示：No store data available for custom location
- **成功动画**：
  - Added to cart 提示
  - 五彩纸屑效果
  - 触觉反馈（移动端）
- **位置设置模态框设计（新增）：**
  - 玻璃拟态背景：bg-white/95 backdrop-blur-xl
  - 圆角设计：rounded-2xl
  - 阴影效果：shadow-2xl
  - **城市搜索框**：带搜索图标，实时过滤，支持自定义输入
  - **自定义城市输入提示**：Enter city name or select from list
  - **添加自定义城市按钮**：[+ Add Custom City] 按钮，渐变背景 from-blue-500 to-blue-600
  - 城市列表卡片：hover:bg-emerald-50 transition
  - **自定义城市标签**：🌍 Custom 标签，bg-blue-100 text-blue-700
  - 城市图标：使用 emoji 或 SVG
  - 选中状态：bg-emerald-100 border-emerald-500
  - 确认按钮：渐变背景 from-emerald-500 to-green-600
- **位置权限提示设计**：
  - 浮动提示框：fixed bottom-4 right-4
  - 玻璃拟态风格：bg-white/90 backdrop-blur-lg
  - 圆角设计：rounded-xl
  - 阴影效果：shadow-lg
  - 图标：📍 位置图标
  - 按钮：[Allow] [Deny] [Manual Setup]
- **位置更新提示设计**：
  - 顶部横幅：bg-blue-50 border-blue-200
  - 图标：🔄 更新图标
  - 文本：Location changed to Delhi. Update delivery city?
  - 按钮：[✅ Update] [❌ Keep Patna]
  - 自动消失：5 秒后淡出
- **自定义位置提示设计（新增）**：
  - 信息横幅：bg-yellow-50 border-yellow-200
  - 图标：⚠️ 警告图标
  - 文本：Custom location selected. Price and availability data may be limited.
  - 自动消失：3 秒后淡出

### 3.2 数据可视化
- Chart.js 用于条形图和折线图
- 交互式进度圆圈和条形图
- 颜色编码的营养进度环

### 3.3 后端服务
**Firebase Authentication：**
- 仅电子邮件/密码身份验证
- 禁用 Google 身份验证

**Firestore Collections：**
- users/{userId}/profile：weight、height、username、email、goals、activity level、target weight、gender、location（city、lat、lng、is_custom）
- users/{userId}/history：带日期、卡路里、食品的搜索记录（自动保存所有搜索）
- users/{userId}/plans：保存的膳食计划
- users/{userId}/searches：自动保存搜索历史
- users/{userId}/favorites：收藏的食品
- users/{userId}/exercises：每日运动选择
- users/{userId}/workout_history：date、calories_burned、exercise_type、duration
- users/{userId}/weekly_plans：当前周 JSON，带完整膳食结构
- users/{userId}/grocery_lists：自动生成的分类购物清单
- users/{userId}/inventory：pantry/fridge/freezer 复选框
- users/{userId}/prep_notes：批量烹饪时间表
- users/{userId}/exercise_favorites：收藏的运动姿势 ID
- users/{userId}/daily_flows：自定义运动序列
- **users/{userId}/shopping_cart**：
  - zepto：[食品列表]
  - blinkit：[食品列表]
  - flipkart：[食品列表]
  - platform_preference：用户偏好平台
  - weekly_total：每周购物总计（基于智能价格估算）
  - price_estimates：每个食品的价格范围数据
- **users/{userId}/location_history（新增）**：
  - timestamp：记录时间
  - city：城市名称
  - lat：纬度
  - lng：经度
  - is_custom：是否为自定义城市（boolean）
  - availability_stats：该位置的食品可用性统计
  - price_range：该位置的价格范围
- **users/{userId}/location_settings（新增）**：
  - auto_detect：是否启用自动检测（boolean）
  - manual_city：手动设置的城市名称
  - is_custom：是否为自定义城市（boolean）
  - last_detected：最后检测到的位置
  - permission_status：位置权限状态（granted/denied/prompt）
- **users/{userId}/custom_cities（新增）**：
  - city_name：自定义城市名称
  - added_date：添加日期
  - usage_count：使用次数

**Firebase Hosting：**
- 部署配置

**Cloud Function（可选 KGAT 集成）：**
- KGAT API 代理，密钥：KGAT_13345494d9391f7a3681ae0e973350c6
- Cloud Function 代码：
```javascript
exports.getKGATFoods = functions.https.onCall(async (data) => {
  return fetch(`YOUR_KGAT_ENDPOINT?key=KGAT_13345494d9391f7a3681ae0e973350c6&q=${data.query}`);
});
```

### 3.4 功能
- 通过 Edamam API 为所有食品搜索提供实时营养数据
- 热门食品列表（50 项）在页面加载时立即加载，带真实食品图片
- 三级图片回退系统（Foodish API → Unsplash → 硬编码映射）
- 图片错误处理与美观的渐变占位符
- 自动连接到 Firebase 项目
- 可分享的每周计划链接
- 每道菜的食谱显示功能，带分步烹饪说明
- 自动保存所有搜索到用户的历史
- 删除单个搜索历史项目
- 一次性清除所有搜索历史
- PWA 支持
- 快速加载
- localStorage 缓存（24 小时）用于离线支持
- 带骨架卡片的加载状态
- 错误处理，回退到缓存数据
- 如果 API 不可用，回退到模拟数据
- 登录/注册时随机生成励志名言
- Yoga Suggestions 和 Weekly Meal Planner 之间的运动到膳食同步
- 基于个人资料数据的个性化运动推荐
- 运动演示的视频集成
- 基于运动消耗的智能卡路里调整
- 完整的每周膳食计划系统（Mon-Sun）
- 自动生成的分类购物清单，带数量计算
- 带复选框的库存管理
- 批量烹饪准备笔记，带时间安排
- 带颜色编码膳食类别的主题之夜
- 在天数之间拖放交换膳食
- 饮食筛选选项
- 每周计划的打印/PDF 导出
- 每周日历的移动端滑动导航
- 营养分解，带宏量营养素追踪
- 个人资料同步的膳食推荐
- 运动卡片的交互式视频播放器
- YouTube 视频嵌入，带自动播放（静音）
- 运动姿势的一键计时器
- 语音教练切换选项
- 运动完成的进度追踪
- 收藏运动姿势
- 分享自定义运动流程
- 基于体重的实时卡路里消耗计算
- 全屏模态框，带动画和背景模糊
- 移动端横屏视频自动旋转
- 姿势完成的触觉反馈
- 语音命令支持（Next pose）
- 图片懒加载与预加载热门图片
- WebP 自动格式化
- 触摸缩放图片
- 滑动画廊（每个食品多角度展示）
- 保存图片到设备
- 类别图片轮播（每 5 秒切换）
- **智能价格估算购买功能**：
  - 基于用户位置的价格范围估算（200+ 食品，多城市数据）
  - 深度链接生成，优先打开应用
  - 智能链接生成，基于食品类别和用户位置
  - 平台偏好记忆
  - 购物车同步到 Firestore
  - 每周购物总计统计（基于智能价格估算和用户位置）
  - 一键添加所有食材到购物车
  - 移动端弹窗快速购买
  - 成功动画与触觉反馈
  - 最优选择徽章显示（🏆 Blinkit 10min）
  - 配送时间显示（[10min] / [18min] / [15min]）
  - 价格范围显示（₹110-120）
  - **所有食品卡片显示购买平台选项（Zepto、Blinkit、Flipkart Minutes）**
  - **自定义位置支持**：显示 Price unavailable 和 ₹-- 占位符
- **位置追踪食品可用性功能（新增）**：
  - Geolocation API 自动检测用户位置
  - 实时显示食品在用户所在位置的可用性状态
  - 库存状态徽章（✅ In Stock / ⚠️ Limited / ❌ Out / ❓ Unknown）
  - 显示附近商店数量
  - 显示最近补货时间
  - 商店详情模态框，显示附近商店列表
  - 每个商店显示距离、库存状态、营业时间
  - 位置历史记录追踪
  - 多城市食品可用性数据库（Patna、Delhi、Mumbai、Bangalore 等）
  - 位置感知价格估算（不同城市不同价格）
  - 仅显示用户所在位置可用的购买平台
  - 购买按钮显示库存状态
  - 购物清单显示整体可用性统计
  - 位置变化时自动更新可用性和价格
  - 位置历史清除功能
  - **自定义位置支持**：显示 Availability unknown 和 ❓ Unknown 徽章
- **位置选项功能（新增）**：
  - **自动位置检测**：
    - 使用 Geolocation API 自动获取用户当前位置
    - 实时检测位置变化
    - 显示位置精度信息
    - 刷新位置功能
    - 位置权限管理
  - **手动位置设置**：
    - 城市选择模态框
    - 城市搜索功能
    - 预设城市列表（Patna、Delhi、Mumbai、Bangalore 等）
    - **自定义城市输入功能**：
      - 用户可输入任意城市名称
      - 实时搜索预设城市列表
      - 支持添加不在预设列表中的自定义城市
      - 自定义城市保存到 Firestore users/{userId}/custom_cities
      - 自定义城市在城市列表中显示，带 🌍 Custom 标签
    - 城市图标和描述
    - 保存配送城市到 Firestore
  - **位置更新提示**：
    - 检测到位置变化时显示提示
    - 用户确认是否更新配送城市
    - 自动消失的横幅提示
  - **位置权限处理**：
    - 首次访问时请求位置权限
    - 权限被拒绝时显示手动设置选项
    - 权限被授予时自动检测位置
    - 位置权限状态管理
  - **位置数据同步**：
    - 位置变化时自动更新价格估算
    - 位置变化时自动更新食品可用性
    - 位置变化时自动更新购买链接
    - 位置历史记录保存
  - **位置显示**：
    - Profile 页面显示当前位置
    - 显示配送城市（预设城市或自定义城市）
    - 显示位置精度
    - 显示位置历史记录
  - **自定义位置处理**：
    - 自定义城市使用默认价格和可用性数据
    - 显示 Price unavailable 和 Availability unknown 提示
    - 自定义城市在位置历史中显示 Custom Location
    - 自定义城市管理功能（查看、删除）

## 4. 外部集成

### 4.1 Edamam Nutrition API（主要）
- API 端点：https://api.edamam.com/api/nutrition-data
- App ID：9b2a2b8e
- App Key：1b3e6f8a8f8b9c0d1e2f3a4b5c6d7e8f
- 用于所有食品搜索的实时营养数据
- 响应解析，用于完整营养成分，包括宏量营养素和微量营养素
- 在 localStorage 中缓存结果 24 小时
- 如果 API 失败，回退到本地模拟数据

### 4.2 Foodish API（食品图片 - Level 1）
- API 端点：https://foodish-api.com/api/images/[category]/[random]
- 支持分类：biryani、burger、dessert、dosa、fries、pizza、random 等
- 提供真实食品照片
- 用于食品卡片的主要图片来源

### 4.3 Unsplash Source（食品图片 - Level 2）
- API 端点：https://source.unsplash.com/300x250/?[food]
- 关键词特定的食品图片
- 当 Foodish API 无法提供匹配图片时使用
- 支持所有食品类型的搜索

### 4.4 KGAT API（可选）
- API 端点：/recommend?key=KGAT_13345494d9391f7a3681ae0e973350c6&target=[calories]
- 用于根据卡路里目标生成膳食推荐
- 如果 API 不可用，回退到硬编码的虚拟数据

### 4.5 YouTube API（运动视频）
- 瑜伽和运动演示的嵌入链接
- 免费瑜伽频道：Yoga with Adriene、FightMaster
- 移动端自动播放（静音）

### 4.6 Giphy（运动 GIF）
- 力量动作的动画 GIF
- 用于快速视觉参考

### 4.7 购买平台集成（智能价格估算 + 深度链接 + 位置感知）
**Zepto：**
- 深度链接：https://www.zepto.com/search
- 参数：q（食品名称）、lat（纬度）、lng（经度）
- 配送时间：18 分钟
- 价格估算：基于用户位置的市场数据
- 深度链接支持：优先打开应用
- 自定义位置：显示 ₹-- 占位符

**Blinkit：**
- 深度链接：https://blinkit.com/search
- 参数：q（食品名称）
- 配送时间：10 分钟 🏆
- 价格估算：基于用户位置的市场数据
- 深度链接支持：优先打开应用
- 自定义位置：显示 ₹-- 占位符

**Flipkart Minutes：**
- 深度链接：https://www.flipkart.com/search
- 参数：q（食品名称 + minutes）
- 配送时间：15 分钟
- 价格估算：基于用户位置的市场数据
- 深度链接支持：优先打开应用
- 自定义位置：显示 ₹-- 占位符

**Geolocation API（新增）：**
- 用于自动检测用户位置
- 获取纬度、经度和城市名称
- 用于生成位置感知的购买链接
- 用于追踪食品可用性
- 位置精度检测
- 位置历史记录
- 位置权限管理
- 实时位置更新

**智能价格估算系统（位置感知）：**
- 无需实时 API 调用
- 基于多城市市场数据的静态价格数据库（200+ 食品，Patna、Delhi、Mumbai、Bangalore 等）
- 价格范围显示（₹110-120）
- 平均价格计算用于每周总计
- 定期更新价格数据（手动维护）
- 根据用户位置自动切换价格数据
- **自定义位置处理**：显示 ₹-- 占位符和 Price unavailable 提示

**食品可用性追踪系统（新增）：**
- 无需实时 API 调用
- 基于多城市商店库存的静态可用性数据库（200+ 食品，Patna、Delhi、Mumbai、Bangalore 等）
- 库存状态：In Stock / Limited Stock / Out of Stock / Unknown
- 附近商店数量统计
- 最近补货时间记录
- 商店详情：距离、库存、营业时间
- 根据用户位置自动切换可用性数据
- 定期更新可用性数据（手动维护）
- **自定义位置处理**：显示 ❓ Unknown 徽章和 Availability unknown 提示

## 5. 数据流
1. 首页：BMI 计算器（例如，75kg→65kg=1980kcal）
2. 注册：email（nandani@gmail.com）、username（nandani）
3. 仪表板：欢迎消息显示 Welcome, nandani! 带随机励志名言
4. Profile：自动检测位置（Patna, Bihar, lat: 25.5941, lng: 85.1376）或手动设置自定义位置 → 最初显示空历史，存储 weight、height、target weight、gender、location（包括 is_custom 标志）
5. 位置设置：用户首次访问 → 请求位置权限 → 用户授予权限 → Geolocation API 自动检测位置（Patna）→ 保存到 Firestore location_settings → 显示 📍 Current Location: Patna, Bihar
6. 手动位置设置：用户点击 Set Delivery City → 模态框打开 → 搜索 Delhi 或输入自定义城市名称（如 Jaipur）→ 选择 Delhi, NCR 或点击 [+ Add Custom City] 添加 Jaipur 🌍 → 保存到 Firestore（自定义城市保存到 custom_cities）→ 所有价格估算和可用性数据自动切换为 Delhi 或显示 Price unavailable / Availability unknown（自定义城市）
7. Food Explorer：用户执行搜索 → 实时 Edamam API 调用 → 通过三级回退系统加载真实食品图片 → 基于用户位置（Patna、Delhi 或自定义城市）检测食品可用性 → 显示带完整营养成分的食品 → 显示位置感知可用性状态（✅ In Stock at 5 stores in Patna 或 ❓ Unknown for custom location）→ 显示智能价格估算购买按钮（基于 Patna、Delhi 或自定义位置，包含 Zepto、Blinkit、Flipkart Minutes 三个平台，自定义位置显示 ₹-- 占位符）
8. 图片加载流程：尝试 Foodish API → 失败则尝试 Unsplash → 失败则使用硬编码映射 → 全部失败则显示美观渐变占位符
9. 用户点击 View Store Details → 显示商店详情模态框 → 查看附近 3 家商店（Blinkit Store - Patna Main 1.2km ✅、Zepto Hub - Boring Road 2.5km ✅、Flipkart Minutes - Fraser Road 3.8km ⚠️）或显示 No store data available for custom location
10. 用户点击 View Full Nutrition Facts → 显示完整营养面板，包含来自 Edamam API 的所有宏量营养素和微量营养素
11. Profile History：自动填充搜索数据
12. 所有后续搜索自动保存到历史并缓存在 localStorage 中
13. Food Explorer：用户点击 Blinkit 按钮（Paneer）→ 生成深度链接：https://blinkit.com/search?q=Paneer → 优先打开 Blinkit 应用 → 显示实时价格 ₹115（基于 Patna、Delhi 或自定义位置，自定义位置显示 Price unavailable）→ 添加到购物车 → 保存到 Firestore shopping_cart，记录价格估算 ₹110-120 和可用性状态 ✅ 或 ❓
14. Food Explorer：用户点击 Flipkart Minutes 按钮（Paneer）→ 生成深度链接：https://www.flipkart.com/search?q=Paneer+minutes → 优先打开 Flipkart 应用 → 显示实时价格 ₹125（基于 Patna、Delhi 或自定义位置，自定义位置显示 Price unavailable）
15. Food Explorer：用户点击 Add to Planner → 带完整营养成分、真实图片、位置感知可用性和智能价格估算购买链接的食品添加到 Weekly Meal Planner
16. Yoga Suggestions：用户设置个人资料（75kg→65kg、Female、Patna 或自定义城市）→ 智能算法生成个性化运动计划（770kcal burn）
17. Weekly Meal Planner：自动调整为每天 2230kcal 膳食（基础 1980kcal + 770kcal burn - 520kcal deficit）→ 每餐显示位置感知可用性（📍 All ingredients available in Patna 或 ❓ Availability unknown for custom location）→ 每餐显示智能价格估算购买按钮（Zepto、Blinkit、Flipkart Minutes，基于 Patna、Delhi 或自定义位置，自定义位置显示 Price unavailable）
18. Weekly Meal Planner：用户点击 BLINKIT CART ₹1780 🏆 ✅ → 生成包含所有 28 种食材的深度链接 → 优先打开 Blinkit 应用 → 显示总价 ₹1780（基于 Patna、Delhi 或自定义位置的智能价格估算，自定义位置显示 Price unavailable）→ 显示可用性 ✅ 28/28 items available in Patna 或 ❓ Availability unknown for custom location → 保存到 Firestore shopping_cart
19. 用户完成锻炼 → 保存到 workout_history → Weekly Chart 更新
20. 登录/注册：每次显示新的励志名言
21. Profile History：用户点击单个历史项目上的 Delete 按钮 → 从 Firestore 和 UI 中删除项目
22. Profile History：用户点击 Clear History 按钮 → 从 Firestore 和 UI 中删除所有搜索历史
23. Exercise Tab：用户访问专用运动界面 → 查看运动历史和成就
24. Weekly Meal Planner：用户点击 Generate Week Plan → 创建完整的 7 天膳食计划，带主题之夜、位置感知可用性和智能价格估算购买链接（Zepto、Blinkit、Flipkart Minutes，基于 Patna、Delhi 或自定义位置，自定义位置显示 Price unavailable / Availability unknown）
25. Grocery List：自动生成，带分类项目、数量、位置感知可用性和智能价格估算 → 显示 Blinkit Total: ₹1780 [10min avg] 🏆 ✅ 28/28 items available / Zepto Total: ₹1820 [18min avg] ✅ 28/28 items available / Flipkart Total: ₹1850 [15min avg] ⚠️ 25/28 items available 或 Price unavailable for custom location → 用户点击 BLINKIT CART ₹1780 🏆 ✅ → 所有食材添加到 Blinkit → 复制到剪贴板
26. Inventory Check：用户切换 pantry/fridge/freezer 项目的复选框
27. Prep Notes：显示周日批量烹饪时间表，带时间段
28. 用户通过拖放在天数之间交换膳食 → 计划在 Firestore 中更新
29. 用户点击 Print/PDF → 导出带所有详细信息（包括位置感知可用性和智能价格估算购买链接）的每周计划
30. 移动端：用户滑动浏览 Mon-Sun 日历 → 点击膳食以显示营养弹窗 + 位置感知可用性 + 智能价格估算购买选项（Zepto、Blinkit、Flipkart Minutes，基于 Patna、Delhi 或自定义位置，自定义位置显示 Price unavailable / Availability unknown）
31. Exercise Tab：用户点击运动卡片（例如 Surya Namaskar）→ 全屏模态框打开
32. 模态框显示：英雄图片（Unsplash）+ YouTube 视频嵌入（自动播放静音）+ 统计数据 + 说明
33. 用户点击 START TIMER → 30s 倒计时开始，带语音教练
34. 用户完成姿势 → 进度更新（3/12 poses complete）
35. 用户点击 FAVORITE → 姿势保存到 Firestore users/{userId}/exercise_favorites
36. 用户点击 DONE → 卡路里消耗保存到 workout_history → Weekly Chart 更新
37. 移动端：用户滑动到下一个姿势 → 模态框内容更新
38. 移动端：视频横屏自动旋转为全屏
39. 用户点击 SHARE → 生成可分享的自定义运动流程链接
40. 类别标签页：图片每 5 秒自动轮播切换
41. 用户触摸缩放食品图片 → 查看高清细节
42. 用户滑动食品卡片 → 查看同一食品的多角度照片
43. 用户点击保存图片 → 图片保存到设备
44. Profile：用户点击 Set Delivery City → 模态框打开 → 选择 Patna 或输入自定义城市名称（如 Jaipur）→ 点击 [+ Add Custom City] 添加 Jaipur 🌍 → 保存到 Firestore custom_cities → 所有购买链接自动更新为 Patna 或自定义位置，价格估算基于 Patna 市场数据或显示 Price unavailable（自定义城市），可用性检测基于 Patna 商店库存或显示 Availability unknown（自定义城市）
45. Profile：用户启用自动位置检测 → Geolocation API 获取 lat/lng（25.5941, 85.1376）→ 识别城市为 Patna → 保存到 Firestore → 购买链接实时更新 → 可用性数据实时更新 → 价格估算实时更新
46. 移动端：用户点击食品卡片 → 弹窗显示 Quick Buy 选项（📍 Availability: ✅ In Stock at 5 stores in Patna 或 ❓ Unknown for custom location + Blinkit ₹110-120 [10min] 🏆 ✅ / Zepto ₹115-125 [18min] ✅ / Flipkart ₹120-130 [15min] ✅ 或 ₹-- for custom location）→ 点击 Blinkit → 深度链接优先打开 Blinkit 应用 → 食品已添加到购物车
47. 用户点击 Blinkit 按钮 → 显示 Added to cart 动画 + 五彩纸屑效果 → 触觉反馈（移动端）→ 保存到 shopping_cart，记录价格估算和可用性状态
48. Profile：显示购物车历史 → 用户查看每周购物总计 ₹1845（基于 Patna、Delhi 或自定义位置的智能价格估算，自定义位置显示 Price unavailable）→ 查看平台偏好（Blinkit 🏆）→ 查看可用性统计（✅ 28/28 items available in Patna 或 ❓ Availability unknown for custom location）
49. Food Explorer：所有食品卡片默认显示位置感知可用性状态（✅ In Stock / ⚠️ Limited / ❌ Out / ❓ Unknown）和三个购买平台按钮（Zepto、Blinkit、Flipkart Minutes，基于 Patna、Delhi 或自定义位置，自定义位置显示 ₹-- 占位符），用户可直接点击任意平台购买
50. 用户从 Patna 移动到 Delhi → Geolocation API 自动检测新位置 → 显示位置更新提示：Location changed to Delhi. Update delivery city? → 用户点击 Update → 更新 Firestore location 数据 → 所有价格估算自动切换为 Delhi 市场数据 → 所有可用性状态自动切换为 Delhi 商店库存 → 购买链接自动更新为 Delhi 位置
51. Profile：用户查看位置历史 → 显示 Feb 28, 2026 09:30 AM - Patna, Bihar (25.5941, 85.1376) → Feb 27, 2026 02:15 PM - Delhi, NCR (28.6139, 77.2090) → Feb 26, 2026 06:45 PM - Jaipur 🌍 (Custom Location) → 每个位置显示该地的食品可用性统计和价格范围（自定义城市显示 Data unavailable / Price unavailable）
52. Profile：用户点击 Clear Location History → 从 Firestore 和 UI 中删除所有位置历史记录
53. 位置权限被拒绝 → 显示手动设置选项 → 用户点击 Set Delivery City → 手动选择城市或输入自定义城市 → 保存到 Firestore
54. 用户点击 Refresh Location → Geolocation API 重新检测位置 → 更新当前位置显示 → 保存到 Firestore location_history
55. Profile：用户点击 Manage Location Permissions → 打开系统位置权限设置页面
56. Profile：用户查看自定义城市管理部分 → 显示所有添加的自定义城市（Jaipur 🌍、Lucknow 🌍 等）→ 点击 [🗑️ Delete] 删除 Jaipur → 从 Firestore custom_cities 中删除
57. Profile：用户点击 Clear All Custom Cities → 从 Firestore 和 UI 中删除所有自定义城市
58. 用户选择自定义城市（Jaipur）→ 显示提示：Custom location selected. Price and availability data may be limited. → 所有价格显示 ₹-- → 所有可用性显示 ❓ Unknown → 购买按钮显示 Price unavailable

## 6. 部署
- Vercel 配置就绪
- 命令：vercel --prod
- Firebase Console 设置：仅启用电子邮件/密码身份验证
- PWA 就绪
- 通过 localStorage 缓存实现快速加载和离线支持，部署就绪
- 首次访问时立即显示热门食品，带真实食品图片、位置感知可用性和智能价格估算购买按钮（Zepto、Blinkit、Flipkart Minutes）
- 通过 Edamam API 为所有搜索提供实时营养数据
- 通过三级回退系统为所有食品提供真实图片
- 绿色 ✅ Live Nutrition Data 状态指示器
- 无 Using Offline Data 警告消息
- 运动视频通过适当的缓存即时加载
- 完整的每周膳食计划系统，可用于生产
- 专业膳食准备应用，具有营养师批准的功能
- 交互式运动体验，带视频、计时器和进度追踪
- 移动端优化，带全屏视频和触觉反馈
- 餐厅级别的食品图片展示
- 图片懒加载与预加载优化
- WebP 格式自动优化
- 美观的渐变占位符作为最终回退
- 所有图片 API 失败时不显示破损视觉效果
- **智能价格估算购买功能完全集成**：
  - 基于多城市市场数据的价格范围估算（200+ 食品，Patna、Delhi、Mumbai、Bangalore 等）
  - 深度链接优先打开应用，回退到网页
  - 购物车同步到 Firestore
  - 位置感知链接生成
  - 移动端弹窗优化
  - 成功动画与触觉反馈
  - 平台 Logo SVG 图标
  - 响应式购买按钮布局
  - 所有 3 个平台（Zepto、Blinkit、Flipkart Minutes）完全集成
  - 最优选择徽章显示（🏆 Blinkit 10min）
  - 配送时间显示（[10min] / [18min] / [15min]）
  - 价格范围显示（₹110-120）
  - 每周购物总计统计（基于智能价格估算）
  - **所有食品卡片默认显示三个购买平台选项**
  - **自定义位置支持**：显示 Price unavailable 和 ₹-- 占位符
- **位置追踪食品可用性功能完全集成**：
  - Geolocation API 自动检测用户位置
  - 实时显示食品在用户所在位置的可用性状态
  - 库存状态徽章（✅ In Stock / ⚠️ Limited / ❌ Out / ❓ Unknown）
  - 附近商店数量统计
  - 最近补货时间显示
  - 商店详情模态框，显示附近商店列表
  - 多城市食品可用性数据库（Patna、Delhi、Mumbai、Bangalore 等）
  - 位置感知价格估算（不同城市不同价格）
  - 仅显示用户所在位置可用的购买平台
  - 购买按钮显示库存状态
  - 购物清单显示整体可用性统计
  - 位置变化时自动更新可用性和价格
  - 位置历史记录追踪
  - 位置历史清除功能
  - **自定义位置支持**：显示 Availability unknown 和 ❓ Unknown 徽章
- **位置选项功能完全集成（新增）**：
  - Geolocation API 自动检测用户位置
  - 手动城市设置模态框
  - 城市搜索功能
  - 预设城市列表（Patna、Delhi、Mumbai、Bangalore 等）
  - **自定义城市输入功能**：
    - 用户可输入任意城市名称
    - 实时搜索预设城市列表
    - 支持添加不在预设列表中的自定义城市
    - 自定义城市保存到 Firestore users/{userId}/custom_cities
    - 自定义城市在城市列表中显示，带 🌍 Custom 标签
  - 位置权限管理
  - 位置更新提示
  - 位置变化时自动更新价格和可用性
  - 位置历史记录追踪
  - 刷新位置功能
  - 位置精度显示
  - 配送城市显示（预设城市或自定义城市）
  - 位置数据同步到 Firestore
  - **自定义城市管理功能**：
    - 查看所有自定义城市列表
    - 删除单个自定义城市
    - 清除所有自定义城市
  - **自定义位置处理**：
    - 自定义城市使用默认价格和可用性数据
    - 显示 Price unavailable 和 Availability unknown 提示
    - 自定义城市在位置历史中显示 Custom Location
- **位置服务配置**：
  - Geolocation API 权限请求
  - 手动城市设置备用方案
  - 自定义城市输入支持
  - 位置数据加密存储
  - 实时位置更新
  - 位置精度检测
  - 位置历史记录
  - 位置权限状态管理
  - 位置更新提示系统
  - 自定义城市管理系统
- **性能优化**：
  - 购买链接预生成
  - 深度链接缓存
  - 平台 Logo 预加载
  - 购物车数据本地缓存
  - 批量购买请求优化
  - 价格数据本地存储（无需实时 API）
  - 智能价格估算算法优化
  - 可用性数据本地存储（无需实时 API）
  - 位置数据缓存
  - 多城市数据预加载
  - 位置检测防抖优化
  - 位置更新节流优化
  - 自定义城市数据缓存