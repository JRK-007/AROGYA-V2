export type IndiaRegion = 'North' | 'South' | 'East' | 'West' | 'Central' | 'North East' | 'Pan-Indian'
export type Food = { id: string; name: string; local: string; category: string; kcal: number; protein: number; carbs: number; fat: number; fiber?: number; saturatedFat?: number; sugar?: number; sodium?: number; source: string; status: 'Estimated' | 'Unverified' | 'Verified'; region?: IndiaRegion; states?: string[]; mealSlots?: string[]; ingredients?: string[] }

// Generic home-style estimates per 100 g cooked edible portion. Recipes vary by
// household, region, oil, ingredients and serving size; these are not IFCT data.
const estimate = 'Arogya Indian recipe estimate · per 100 g cooked · household recipes vary'
const item = (id:string,name:string,local:string,category:string,region:IndiaRegion,states:string[],kcal:number,protein:number,carbs:number,fat:number,fiber:number,mealSlots:string[],ingredients:string[]=[]):Food => ({ id:`in-${id}`,name,local,category,region,states,kcal,protein,carbs,fat,fiber,mealSlots,ingredients,source:estimate,status:'Estimated' })

export const foods: Food[] = [
  item('idli','Idli','இட்லி · steamed rice-lentil cakes','Breakfast', 'South',['Tamil Nadu','Karnataka','Kerala','Andhra Pradesh','Telangana'],146,4.5,29,1.1,1.5,['Breakfast','Snack'],['rice','urad dal','fermentation']),
  item('sambar','Sambar','சாம்பார் · lentil and vegetable stew','Dal & curry','South',['Tamil Nadu','Karnataka','Kerala','Andhra Pradesh','Telangana'],74,3.8,10,2.1,2.7,['Breakfast','Lunch','Dinner'],['toor dal','vegetables','tamarind','spices']),
  item('plain-dosa','Plain dosa','தோசை · fermented rice-lentil crepe','Breakfast','South',['Tamil Nadu','Karnataka','Kerala','Andhra Pradesh','Telangana'],168,4.2,28,4.1,1.4,['Breakfast','Dinner'],['rice','urad dal','oil']),
  item('masala-dosa','Masala dosa','மசாலா தோசை · potato-filled dosa','Breakfast','South',['Tamil Nadu','Karnataka','Kerala','Andhra Pradesh','Telangana'],190,4.0,29,6.2,2.4,['Breakfast','Dinner'],['dosa batter','potato masala','oil']),
  item('pongal','Ven pongal','வெண் பொங்கல் · rice and moong dal','Breakfast','South',['Tamil Nadu'],166,5.0,25,4.4,2.0,['Breakfast'],['rice','moong dal','pepper','ghee']),
  item('upma','Vegetable upma','உப்புமா · semolina and vegetables','Breakfast','South',['Tamil Nadu','Karnataka','Kerala','Andhra Pradesh','Telangana'],150,4.0,24,4.2,2.2,['Breakfast','Snack'],['rava','vegetables','oil']),
  item('appam','Appam','അപ്പം · fermented rice pancake','Breakfast','South',['Kerala','Tamil Nadu'],145,2.8,29,1.7,0.8,['Breakfast','Dinner'],['rice','coconut milk','fermentation']),
  item('puttu','Puttu','പുട്ട് · steamed rice and coconut','Breakfast','South',['Kerala'],174,3.2,34,3.0,2.2,['Breakfast'],['rice flour','coconut']),
  item('pesarattu','Pesarattu','పెసరట్టు · green gram crepe','Breakfast','South',['Andhra Pradesh','Telangana'],164,8.1,23,4.1,4.2,['Breakfast'],['whole green gram','ginger','oil']),
  item('ragi-mudde','Ragi mudde','ರಾಗಿ ಮುದ್ದೆ · finger millet ball','Staple','South',['Karnataka'],119,3.2,25,1.0,3.2,['Lunch','Dinner'],['ragi flour','water']),
  item('curd-rice','Curd rice','தயிர் சாதம் · yogurt rice','Rice dish','South',['Tamil Nadu','Karnataka','Kerala','Andhra Pradesh','Telangana'],132,3.7,23,2.8,0.5,['Lunch','Dinner'],['rice','curd','tempering']),
  item('lemon-rice','Lemon rice','எலுமிச்சை சாதம் · tempered lemon rice','Rice dish','South',['Tamil Nadu','Karnataka','Andhra Pradesh','Telangana'],174,3.6,29,5.0,1.3,['Lunch','Dinner'],['rice','lemon','peanuts','tempering']),
  item('avial','Avial','അവியல் · mixed vegetables and coconut','Vegetable curry','South',['Kerala','Tamil Nadu'],105,2.6,12,5.5,3.5,['Lunch','Dinner'],['seasonal vegetables','coconut','curd']),
  item('bisibelebath','Bisi bele bath','ಬಿಸಿ ಬೇಳೆ ಬಾತ್ · lentil rice with vegetables','Rice dish','South',['Karnataka'],148,4.7,25,3.3,2.6,['Lunch'],['rice','toor dal','vegetables','spices']),
  item('kerala-puttu-kadala','Puttu with kadala curry','പുട്ടും കടലക്കറിയും · steamed rice and chickpeas','Meal combination','South',['Kerala'],156,5.8,26,3.4,4.5,['Breakfast'],['puttu','black chickpeas','coconut']),
  item('poha','Kanda poha','कांदा पोहा · flattened rice with onion','Breakfast','West',['Maharashtra','Madhya Pradesh','Gujarat'],156,3.2,27,4.0,2.0,['Breakfast','Snack'],['poha','onion','peanuts','oil']),
  item('sabudana-khichdi','Sabudana khichdi','साबुदाणा खिचड़ी · tapioca pearls and peanuts','Breakfast','West',['Maharashtra','Madhya Pradesh','Gujarat'],209,2.8,35,6.2,1.3,['Breakfast','Snack'],['sabudana','potato','peanuts','ghee']),
  item('thepla','Methi thepla','થેપલા · fenugreek flatbread','Breakfast','West',['Gujarat'],224,6.2,34,6.7,4.0,['Breakfast','Lunch','Snack'],['whole wheat flour','fenugreek','yogurt']),
  item('dhokla','Khaman dhokla','ઢોકળા · steamed gram flour cake','Snack','West',['Gujarat'],160,7.5,22,4.5,3.2,['Breakfast','Snack'],['besan','curd','tempering']),
  item('misal','Misal','मिसळ · sprouted moth bean curry','Breakfast','West',['Maharashtra'],143,7.4,20,3.5,5.0,['Breakfast','Lunch'],['sprouted moth beans','spices','onion']),
  item('pav-bhaji','Pav bhaji','पाव भाजी · spiced mashed vegetables with bread','Meal combination','West',['Maharashtra'],172,4.0,27,5.4,3.8,['Lunch','Dinner','Snack'],['potato','mixed vegetables','bread','butter']),
  item('undhiyu','Undhiyu','ઊંધિયું · Gujarati mixed winter vegetables','Vegetable curry','West',['Gujarat'],132,4.2,17,5.2,5.0,['Lunch','Dinner'],['seasonal vegetables','methi dumplings','oil']),
  item('dal-baati','Dal baati churma','दाल बाटी · lentils, baked wheat and sweet crumble','Meal combination','West',['Rajasthan'],228,7.2,34,7.0,4.2,['Lunch'],['wheat baati','panchmel dal','ghee','churma']),
  item('goan-fish-curry','Goan fish curry','Xitt kodi · coastal fish and coconut curry','Fish curry','West',['Goa'],131,13.0,5,6.6,1.3,['Lunch','Dinner'],['fish','coconut','kokum']),
  item('chapati','Phulka / chapati','रोटी · whole-wheat flatbread','Staple','North',['Punjab','Haryana','Delhi','Uttar Pradesh','Uttarakhand','Rajasthan','Himachal Pradesh'],265,8.5,49,4.0,7.0,['Breakfast','Lunch','Dinner'],['whole wheat flour','water']),
  item('paratha','Aloo paratha','आलू पराठा · potato-stuffed flatbread','Breakfast','North',['Punjab','Haryana','Delhi','Uttar Pradesh','Uttarakhand'],245,6.5,37,7.0,4.1,['Breakfast','Lunch'],['whole wheat flour','potato','oil']),
  item('paneer-paratha','Paneer paratha','पनीर पराठा · cottage-cheese flatbread','Breakfast','North',['Punjab','Haryana','Delhi','Uttar Pradesh'],276,10.0,34,10.0,3.5,['Breakfast','Lunch'],['whole wheat flour','paneer','spices']),
  item('rajma','Rajma masala','राजमा · kidney bean curry','Dal & curry','North',['Punjab','Himachal Pradesh','Jammu and Kashmir','Delhi','Uttarakhand'],132,7.5,18,3.5,6.0,['Lunch','Dinner'],['kidney beans','tomato','onion','spices']),
  item('chole','Chole masala','छोले · chickpea curry','Dal & curry','North',['Punjab','Haryana','Delhi','Uttar Pradesh'],151,7.8,22,4.0,6.1,['Breakfast','Lunch','Dinner'],['chickpeas','tomato','onion','spices']),
  item('sarson-saag','Sarson ka saag','सरसों का साग · mustard greens','Vegetable curry','North',['Punjab','Haryana'],101,4.0,10,5.6,4.2,['Lunch','Dinner'],['mustard greens','spinach','maize flour']),
  item('makki-roti','Makki di roti','मक्की दी रोटी · maize flatbread','Staple','North',['Punjab','Haryana','Himachal Pradesh'],220,5.2,43,3.0,5.2,['Lunch','Dinner'],['maize flour','water']),
  item('kadhi','Punjabi kadhi pakora','कढ़ी · yogurt and gram-flour curry','Dal & curry','North',['Punjab','Haryana','Delhi','Uttar Pradesh'],138,5.0,14,7.0,2.0,['Lunch','Dinner'],['curd','besan','pakora','spices']),
  item('aloo-gobi','Aloo gobi','आलू गोभी · potato and cauliflower','Vegetable curry','North',['Punjab','Haryana','Uttar Pradesh','Delhi'],109,3.2,15,4.1,3.5,['Lunch','Dinner'],['potato','cauliflower','spices']),
  item('litti-chokha','Litti chokha','लिट्टी चोखा · roasted wheat balls and mash','Meal combination','East',['Bihar','Jharkhand'],213,7.5,31,6.0,5.6,['Lunch','Dinner'],['wheat','sattu','brinjal','tomato']),
  item('ghugni','Ghugni','ঘুগনি · yellow-pea curry','Dal & curry','East',['West Bengal','Odisha','Assam'],125,7.2,18,2.8,5.7,['Breakfast','Snack'],['yellow peas','potato','spices']),
  item('macher-jhol','Bengali macher jhol','মাছের ঝোল · light fish curry','Fish curry','East',['West Bengal','Tripura'],112,14.0,4,4.5,1.0,['Lunch','Dinner'],['freshwater fish','potato','tomato','mustard oil']),
  item('shukto','Shukto','শুক্তো · Bengali mixed vegetable stew','Vegetable curry','East',['West Bengal'],92,2.8,12,4.0,3.4,['Lunch'],['bitter gourd','green banana','milk','spices']),
  item('dalma','Dalma','ଡାଲମା · lentils with vegetables','Dal & curry','East',['Odisha'],103,5.7,15,2.2,4.3,['Lunch','Dinner'],['toor dal','pumpkin','raw banana','spices']),
  item('pakhala','Pakhala bhata','ପଖାଳ ଭାତ · fermented rice and curd water','Rice dish','East',['Odisha'],105,2.8,22,0.8,0.7,['Lunch'],['cooked rice','curd water','tempering']),
  item('assam-khar','Assam khar','খাৰ · alkaline seasonal vegetable dish','Vegetable curry','North East',['Assam'],76,2.7,10,3.1,3.1,['Lunch'],['raw papaya','pulses','alkaline khar']),
  item('masor-tenga','Masor tenga','মাছৰ টেঙা · Assamese sour fish curry','Fish curry','North East',['Assam'],101,13.8,3,3.7,0.8,['Lunch','Dinner'],['fish','tomato','lemon']),
  item('momos-veg','Steamed vegetable momos','मोमो · steamed vegetable dumplings','Snack','North East',['Sikkim','Arunachal Pradesh','Meghalaya','Nagaland'],168,5.0,30,3.0,2.6,['Snack'],['wheat wrapper','cabbage','carrot']),
  item('thukpa','Vegetable thukpa','थुक्पा · Himalayan noodle soup','Soup','North East',['Sikkim','Arunachal Pradesh','Ladakh'],88,3.8,14,1.8,2.1,['Lunch','Dinner'],['noodles','vegetables','broth']),
  item('chicken-bamboo','Chicken with bamboo shoot','চিকেন বাঁহগাজ · chicken and bamboo-shoot curry','Meat curry','North East',['Assam','Nagaland','Manipur','Mizoram','Arunachal Pradesh'],137,15.5,4,6.5,1.3,['Lunch','Dinner'],['chicken','bamboo shoot','herbs']),
  item('bajra-khichdi','Bajra khichdi','बाजरे की खिचड़ी · pearl millet and lentils','Rice dish','Central',['Rajasthan','Madhya Pradesh','Gujarat'],148,5.0,26,3.0,4.1,['Lunch','Dinner'],['pearl millet','moong dal','vegetables']),
  item('poha-jalebi','Poha with jalebi','पोहा जलेबी · flattened rice and sweet','Meal combination','Central',['Madhya Pradesh'],205,3.0,40,4.2,1.7,['Breakfast'],['poha','jalebi','peanuts']),
  item('dal-pitha','Dal pitha','दाल पीठा · steamed lentil-stuffed dumpling','Snack','East',['Bihar','Jharkhand','Uttar Pradesh'],178,7.0,29,3.0,4.0,['Breakfast','Snack'],['rice flour','chana dal','spices']),
  item('rice-cooked','Steamed rice','भात / சாதம் · cooked rice','Staple','Pan-Indian',['Tamil Nadu','Kerala','Karnataka','Andhra Pradesh','Telangana','West Bengal','Odisha','Assam','Tripura','Manipur','Maharashtra','Goa'],130,2.7,28,0.3,0.4,['Lunch','Dinner'],['rice','water']),
  item('dal-tadka','Dal tadka','दाल तड़का · tempered lentils','Dal & curry','Pan-Indian',['Punjab','Delhi','Maharashtra','Uttar Pradesh','Madhya Pradesh'],119,6.5,15,3.5,4.7,['Lunch','Dinner'],['toor dal','tomato','tempering']),
  item('khichdi','Moong dal khichdi','खिचड़ी · rice and moong lentils','Rice dish','Pan-Indian',['Uttar Pradesh','Bihar','Gujarat','Madhya Pradesh','Rajasthan','Maharashtra'],117,4.3,21,2.1,2.5,['Lunch','Dinner'],['rice','moong dal','turmeric']),
  item('veg-pulao','Vegetable pulao','वेज पुलाव · spiced rice and vegetables','Rice dish','Pan-Indian',['Delhi','Uttar Pradesh','Maharashtra','Karnataka','Telangana'],154,3.7,27,3.8,2.1,['Lunch','Dinner'],['rice','mixed vegetables','spices']),
  item('veg-biryani','Vegetable biryani','वेज बिरयानी · layered rice and vegetables','Rice dish','Pan-Indian',['Telangana','Andhra Pradesh','Uttar Pradesh','Karnataka','Tamil Nadu'],176,4.2,29,4.8,2.6,['Lunch','Dinner'],['rice','vegetables','yogurt','spices']),
  item('egg-curry','Egg curry','अंडा करी · eggs in tomato-onion gravy','Meat curry','Pan-Indian',['West Bengal','Maharashtra','Delhi','Kerala','Tamil Nadu'],151,9.2,7,9.0,1.4,['Lunch','Dinner'],['egg','tomato','onion','spices']),
  item('chicken-curry','Home-style chicken curry','चिकन करी · chicken in spiced gravy','Meat curry','Pan-Indian',['Punjab','Delhi','West Bengal','Maharashtra','Karnataka','Telangana'],166,17.5,5,8.5,1.0,['Lunch','Dinner'],['chicken','tomato','onion','spices']),
  item('masoor-dal','Masoor dal','मसूर दाल · red lentil curry','Dal & curry','Pan-Indian',['Punjab','Delhi','Uttar Pradesh','West Bengal','Maharashtra'],112,7.0,16,2.2,5.3,['Lunch','Dinner'],['red lentils','tomato','spices']),
  item('palak-paneer','Palak paneer','पालक पनीर · spinach and cottage cheese','Vegetable curry','North',['Punjab','Delhi','Haryana','Uttar Pradesh'],165,8.5,7,11.2,2.8,['Lunch','Dinner'],['spinach','paneer','tomato']),
  item('paneer-bhurji','Paneer bhurji','पनीर भुर्जी · spiced scrambled paneer','Breakfast','North',['Punjab','Delhi','Haryana','Uttar Pradesh'],188,11.5,7,12.5,1.7,['Breakfast','Lunch','Dinner'],['paneer','tomato','onion']),
  item('chicken-biryani','Chicken biryani','चिकन बिरयानी · spiced rice and chicken','Rice dish','Pan-Indian',['Telangana','Andhra Pradesh','Karnataka','Tamil Nadu','Uttar Pradesh'],188,9.2,24,5.8,1.2,['Lunch','Dinner'],['rice','chicken','yogurt','spices']),
  item('raita','Cucumber raita','खीरा रायता · yogurt with cucumber','Side dish','Pan-Indian',['Punjab','Delhi','Rajasthan','Uttar Pradesh','Haryana'],68,3.5,5,3.5,0.5,['Lunch','Dinner'],['curd','cucumber','roasted cumin']),
  item('sprouts-chaat','Moong sprouts chaat','अंकुरित मूंग चाट · sprouted mung snack','Snack','Pan-Indian',['Maharashtra','Delhi','Uttar Pradesh','Gujarat'],103,7.2,16,1.3,4.6,['Breakfast','Snack'],['sprouted moong','tomato','lemon']),
  item('roasted-chana','Roasted chana','भुना चना · roasted Bengal gram','Snack','Pan-Indian',['Uttar Pradesh','Bihar','Madhya Pradesh','Rajasthan','Maharashtra'],369,20.0,59,6.0,12.0,['Snack'],['Bengal gram']),
  item('masala-chai','Masala chai with milk','मसाला चाय · tea with milk','Beverage','Pan-Indian',['Pan-Indian'],44,1.5,6,1.5,0,['Breakfast','Snack'],['tea','milk','spices','optional sugar']),
  item('lassi','Plain salted lassi','लस्सी · yogurt drink','Beverage','North',['Punjab','Haryana','Delhi','Rajasthan'],68,3.5,5,3.5,0,['Breakfast','Snack'],['curd','water','salt']),
  item('kheer','Rice kheer','खीर · rice pudding','Sweet','Pan-Indian',['Pan-Indian'],143,3.8,22,4.5,0.3,['Dessert','Snack'],['rice','milk','sugar']),
  item('besan-ladoo','Besan ladoo','बेसन लड्डू · gram-flour sweet','Sweet','West',['Maharashtra','Gujarat','Rajasthan'],447,10.0,47,24,6.0,['Dessert','Snack'],['besan','ghee','sugar']),
]

export const indianStates = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry']
const regionalStates:Record<IndiaRegion,string[]> = {
  North:['Chandigarh','Delhi','Haryana','Himachal Pradesh','Jammu and Kashmir','Ladakh','Punjab','Rajasthan','Uttar Pradesh','Uttarakhand'],
  South:['Andhra Pradesh','Karnataka','Kerala','Puducherry','Tamil Nadu','Telangana'],
  East:['Bihar','Jharkhand','Odisha','West Bengal'],
  West:['Goa','Gujarat','Maharashtra','Dadra and Nagar Haveli and Daman and Diu'],
  Central:['Chhattisgarh','Madhya Pradesh'],
  'North East':['Arunachal Pradesh','Assam','Manipur','Meghalaya','Mizoram','Nagaland','Sikkim','Tripura'],
  'Pan-Indian':indianStates,
}
export function regionForState(state:string):IndiaRegion { return (Object.entries(regionalStates).find(([region,states])=>region!=='Pan-Indian'&&states.includes(state))?.[0] as IndiaRegion|undefined)||'Pan-Indian' }
export function regionsForState(state:string):IndiaRegion[] { const local=regionForState(state);return local==='Pan-Indian'?['Pan-Indian']:[local,'Pan-Indian'] }
export function isIndiaRegion(value:string):value is IndiaRegion { return ['North','South','East','West','Central','North East','Pan-Indian'].includes(value) }
export type IndiaLocation={city:string;state:string;region:IndiaRegion;source:'detected'|'manual';updatedAt:string}
