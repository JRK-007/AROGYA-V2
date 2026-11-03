export type LanguageCode = 'en' | 'ta' | 'hi'

const messages: Record<Exclude<LanguageCode, 'en'>, Record<string, string>> = {
  ta: {
    Overview: 'கண்ணோட்டம்', 'Health Assessment': 'உடல்நல மதிப்பீடு', 'Body Composition': 'உடல் அமைப்பு', 'Nutrition Planner': 'ஊட்டச்சத்து திட்டம்', 'Food Database': 'உணவு தரவுத்தளம்', 'Food Diary': 'உணவு பதிவு', 'Workout Planner': 'உடற்பயிற்சி திட்டம்', 'Fitness Analytics': 'உடற்பயிற்சி பகுப்பாய்வு', 'Health Reports': 'உடல்நல அறிக்கைகள்', 'Nearby Fitness Centres': 'அருகிலுள்ள உடற்பயிற்சி மையங்கள்', 'Profile & Settings': 'சுயவிவரம் மற்றும் அமைப்புகள்',
    TRACK: 'கண்காணிப்பு', NUTRITION: 'ஊட்டச்சத்து', FITNESS: 'உடற்பயிற்சி', MORE: 'மேலும்', Workspace: 'பணியிடம்', 'New assessment': 'புதிய மதிப்பீடு', 'Your nutrition plan': 'உங்கள் ஊட்டச்சத்து திட்டம்', 'Food database': 'உணவு தரவுத்தளம்', 'Food diary': 'உணவு பதிவு', 'Nearby fitness centres': 'அருகிலுள்ள உடற்பயிற்சி மையங்கள்', 'Profile & settings': 'சுயவிவரம் மற்றும் அமைப்புகள்', 'Build your weekly plan': 'வாராந்திர திட்டத்தை உருவாக்கவும்', 'Generate my plan': 'என் திட்டத்தை உருவாக்கு', 'Workout history': 'உடற்பயிற்சி வரலாறு', 'Saved meal combinations': 'சேமித்த உணவு சேர்க்கைகள்', 'Recent nutrition history': 'சமீபத்திய ஊட்டச்சத்து வரலாறு', 'Save today as favourite': 'இன்றையதை விருப்பமாக சேமி', 'Export history CSV': 'வரலாற்றை CSV ஆக ஏற்றுமதி செய்', 'Search foods': 'உணவுகளைத் தேடு', 'Copy previous day': 'முந்தைய நாளை நகலெடு', 'Sign in': 'உள்நுழை', 'Create account': 'கணக்கை உருவாக்கு', 'Reset password': 'கடவுச்சொல்லை மீட்டமை', 'Export my data': 'என் தரவை ஏற்றுமதி செய்',
  },
  hi: {
    Overview: 'अवलोकन', 'Health Assessment': 'स्वास्थ्य मूल्यांकन', 'Body Composition': 'शरीर संरचना', 'Nutrition Planner': 'पोषण योजना', 'Food Database': 'खाद्य डेटाबेस', 'Food Diary': 'भोजन डायरी', 'Workout Planner': 'वर्कआउट योजना', 'Fitness Analytics': 'फिटनेस विश्लेषण', 'Health Reports': 'स्वास्थ्य रिपोर्ट', 'Nearby Fitness Centres': 'आस-पास के फिटनेस केंद्र', 'Profile & Settings': 'प्रोफ़ाइल और सेटिंग्स',
    TRACK: 'ट्रैकिंग', NUTRITION: 'पोषण', FITNESS: 'फिटनेस', MORE: 'अधिक', Workspace: 'कार्यस्थान', 'New assessment': 'नया मूल्यांकन', 'Your nutrition plan': 'आपकी पोषण योजना', 'Food database': 'खाद्य डेटाबेस', 'Food diary': 'भोजन डायरी', 'Nearby fitness centres': 'आस-पास के फिटनेस केंद्र', 'Profile & settings': 'प्रोफ़ाइल और सेटिंग्स', 'Build your weekly plan': 'साप्ताहिक योजना बनाएँ', 'Generate my plan': 'मेरी योजना बनाएँ', 'Workout history': 'वर्कआउट इतिहास', 'Saved meal combinations': 'सहेजे गए भोजन संयोजन', 'Recent nutrition history': 'हाल का पोषण इतिहास', 'Save today as favourite': 'आज को पसंदीदा के रूप में सहेजें', 'Export history CSV': 'इतिहास CSV निर्यात करें', 'Search foods': 'खाद्य खोजें', 'Copy previous day': 'पिछला दिन कॉपी करें', 'Sign in': 'साइन इन', 'Create account': 'खाता बनाएँ', 'Reset password': 'पासवर्ड रीसेट करें', 'Export my data': 'मेरा डेटा निर्यात करें',
  },
}

export function translate(language: LanguageCode | string, message: string) {
  if (language === 'ta' || language === 'hi') return messages[language][message] || message
  return message
}
