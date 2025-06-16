// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Send, Bot, User, Camera} from 'lucide-react';
// import Papa from 'papaparse';

// interface Photographer {
//   photographer_id: number;
//   user_id: number;
//   bio: string;
//   price_per_hour: number;
//   experience_years: number;
//   avatar_url: string | null;
//   social_media_links: string | null;
//   phone_number: string | null;
//   email: string | null;
//   average_rating: number;
//   review_count: number;
//   created_at: string;
//   updated_at: string | null;
//   tags: string[];
//   total_bookings: number;
//   followers_count: number;
// }

// interface Message {
//   id: number;
//   type: 'user' | 'bot';
//   content: string;
// }

// interface SearchParams {
//   maxPrice: number | null;
//   minPrice: number | null;
//   minExperience: number | null;
//   searchTags: string[];
// }

// interface CSVRow {
//   photographer_id: string;
//   user_id: string;
//   bio: string;
//   price_per_hour: string;
//   experience_years: string;
//   avatar_url: string | null;
//   social_media_links: string | null;
//   phone_number: string | null;
//   email: string | null;
//   average_rating: string;
//   review_count: string;
//   created_at: string;
//   updated_at: string | null;
//   tags: string;
//   total_bookings: string;
//   followers_count: string;
// }

// const PhotographerChatbot = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState('');
//   const [photographers, setPhotographers] = useState<Photographer[]>([]);
//   const [loading, setLoading] = useState(false);

//   // CSV data - in a real app, this would be loaded from your file
//   const csvData = `"photographer_id","user_id","bio","price_per_hour","experience_years","avatar_url","social_media_links","phone_number","email","average_rating","review_count","created_at","updated_at","tags","total_bookings","followers_count"
// 1,28,"Chuyên chụp ảnh cưới và ngoại cảnh","500000.00",2,NULL,NULL,NULL,NULL,"0.0",0,"2025-04-28 17:14:54.056887+00",NULL,"{Marketing,""Quảng cáo""}",0,2
// 2,29,"ptg2","600000.00",3,NULL,NULL,NULL,NULL,"0.0",0,"2025-04-28 17:14:54.056887+00",NULL,"{""Kiến trúc – nội thất"",""Phong cảnh"",""Nghệ thuật""}",0,0
// 3,30,"Chụp ảnh sự kiện và gia đình","450000.00",1,NULL,NULL,NULL,NULL,"0.0",0,"2025-04-28 17:14:54.056887+00",NULL,"{""Chân dung"",""Nghệ thuật"",""Kiến trúc – nội thất""}",0,0
// 4,31,"Chuyên gia chụp ảnh chân dung","700000.00",4,NULL,NULL,NULL,NULL,"0.0",0,"2025-04-28 17:14:54.056887+00",NULL,"{""Kỷ yếu"",""Sự kiện"",""Thời trang"",""Chân dung""}",0,0
// 5,32,"Chụp ảnh phong cảnh và du lịch","550000.00",1,NULL,NULL,NULL,NULL,"0.0",0,"2025-04-28 17:14:54.056887+00",NULL,"{""Gia đình"",""Mẹ và bé"",""Profile cá nhân""}",0,0
// 14,64,"Xin chào quý khách hàng. Tôi là Việt\\nTôi có nhiều năm kinh nghiệm trong nghề\\nHãy cùng nhau tạo nên những khoảnh khắc thật đáng nhớ\\n💖💖💖","300000.00",5,"https://images.unsplash.com/photo-1526449066878-320ea3ca7a95?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","{"""": """", ""youtube"": ""cde.com"", ""facebook"": ""abc.com"", ""instagram"": ""ghi.com""}",NULL,NULL,"5.0",2,"2025-04-29 04:52:08.65865+00",NULL,"{""Du lịch"",""Ẩm thực"",""Chân dung"",""Kiến trúc – nội thất"",""Sản phẩm""}",13,3
// 21,72,"Chào mọi người mình là Hoàng\\n---\\nSử dụng máy Cannon\\n📷","300000.00",5,NULL,"{""zalo"": ""https://www.facebook.com/03022003.imhoang/"", ""facebook"": ""https://www.facebook.com/03022003.imhoang/"", ""linkedin"": ""https://www.facebook.com/03022003.imhoang/"", ""instagram"": ""https://www.facebook.com/03022003.imhoang/""}",NULL,NULL,"0.0",0,"2025-05-17 09:57:18.888794+00",NULL,"{""Sản phẩm"",""Ẩm thực"",""Phong cảnh"",""Du lịch"",""Thời trang""}",0,0`;

//   useEffect(() => {
//     // Parse CSV data
//     Papa.parse(csvData, {
//       header: true,
//       complete: (results: Papa.ParseResult<CSVRow>) => {
//         const cleanedData = results.data.filter((row: CSVRow) => row.photographer_id).map((row: CSVRow) => ({
//           ...row,
//           photographer_id: parseInt(row.photographer_id),
//           user_id: parseInt(row.user_id),
//           tags: row.tags ? row.tags.replace(/[{}]/g, '').split(',').map((tag: string) => tag.replace(/"/g, '').trim()) : [],
//           price_per_hour: parseFloat(row.price_per_hour) || 0,
//           experience_years: parseInt(row.experience_years) || 0,
//           average_rating: parseFloat(row.average_rating) || 0,
//           review_count: parseInt(row.review_count) || 0,
//           total_bookings: parseInt(row.total_bookings) || 0,
//           followers_count: parseInt(row.followers_count) || 0
//         }));
//         setPhotographers(cleanedData);
//       }
//     });

//     // Initial greeting
//     setMessages([{
//       id: 1,
//       type: 'bot',
//       content: 'Xin chào! Tôi là chatbot hỗ trợ tìm kiếm photographer. Bạn có thể hỏi tôi về:\n\n• Tìm photographer theo giá cả\n• Tìm theo chuyên môn (ảnh cưới, chân dung, sự kiện...)\n• Tìm theo kinh nghiệm\n• Thông tin chi tiết về photographer\n\nHãy thử hỏi: "Tìm photographer chụp ảnh cưới dưới 400k" hoặc "Photographer nào có kinh nghiệm nhất?"'
//     }]);
//   }, []);

//   const parseQuery = (query: string): SearchParams => {
//     const lowerQuery = query.toLowerCase();
    
//     // Parse price queries
//     let maxPrice = null;
//     const minPrice = null;
    
//     const priceMatch = lowerQuery.match(/(\d+)k|(\d+)000|(\d+)\s*triệu/);
//     if (priceMatch) {
//       if (priceMatch[1]) maxPrice = parseInt(priceMatch[1]) * 1000;
//       if (priceMatch[2]) maxPrice = parseInt(priceMatch[2]) * 1000;
//       if (priceMatch[3]) maxPrice = parseInt(priceMatch[3]) * 1000000;
//     }

//     // Parse experience queries
//     let minExperience = null;
//     const expMatch = lowerQuery.match(/(\d+)\s*năm/);
//     if (expMatch) {
//       minExperience = parseInt(expMatch[1]);
//     }

//     // Parse tag/specialty queries
//     const tagKeywords: Record<string, string[]> = {
//       'cưới': ['Ảnh cưới', 'cưới'],
//       'chân dung': ['Chân dung'],
//       'gia đình': ['Gia đình'],
//       'sự kiện': ['Sự kiện'],
//       'phong cảnh': ['Phong cảnh'],
//       'du lịch': ['Du lịch'],
//       'thời trang': ['Thời trang'],
//       'sản phẩm': ['Sản phẩm'],
//       'kỷ yếu': ['Kỷ yếu'],
//       'kiến trúc': ['Kiến trúc – nội thất'],
//       'ẩm thực': ['Ẩm thực'],
//       'mẹ và bé': ['Mẹ và bé']
//     };

//     const searchTags: string[] = [];
//     Object.keys(tagKeywords).forEach(keyword => {
//       if (lowerQuery.includes(keyword)) {
//         searchTags.push(...tagKeywords[keyword]);
//       }
//     });

//     return { maxPrice, minPrice, minExperience, searchTags };
//   };

//   const searchPhotographers = (query: string): Photographer[] => {
//     const { maxPrice, minPrice, minExperience, searchTags } = parseQuery(query);
    
//     const results = photographers.filter(p => {
//       // Price filter
//       if (maxPrice && p.price_per_hour > maxPrice) return false;
//       if (minPrice && p.price_per_hour < minPrice) return false;
      
//       // Experience filter
//       if (minExperience && p.experience_years < minExperience) return false;
      
//       // Tag filter
//       if (searchTags.length > 0) {
//         const hasMatchingTag = searchTags.some(searchTag => 
//           p.tags.some(tag => tag.toLowerCase().includes(searchTag.toLowerCase()))
//         );
//         if (!hasMatchingTag) return false;
//       }
      
//       // Text search in bio
//       const lowerQuery = query.toLowerCase();
//       if (!maxPrice && !minPrice && !minExperience && searchTags.length === 0) {
//         return p.bio && p.bio.toLowerCase().includes(lowerQuery);
//       }
      
//       return true;
//     });

//     // Sort by rating, then by experience
//     results.sort((a, b) => {
//       if (b.average_rating !== a.average_rating) {
//         return b.average_rating - a.average_rating;
//       }
//       return b.experience_years - a.experience_years;
//     });

//     return results;
//   };

//   const generateResponse = (query: string): string => {
//     const lowerQuery = query.toLowerCase();
    
//     // Handle greeting
//     if (lowerQuery.includes('xin chào') || lowerQuery.includes('hello') || lowerQuery.includes('chào')) {
//       return 'Xin chào! Tôi có thể giúp bạn tìm photographer phù hợp. Bạn muốn tìm theo tiêu chí gì?';
//     }

//     // Handle statistics queries
//     if (lowerQuery.includes('có bao nhiêu') || lowerQuery.includes('tổng số')) {
//       return `Hiện tại có ${photographers.length} photographer trong hệ thống.`;
//     }

//     if (lowerQuery.includes('đắt nhất') || lowerQuery.includes('giá cao nhất')) {
//       const mostExpensive = photographers.reduce((max, p) => 
//         p.price_per_hour > max.price_per_hour ? p : max
//       );
//       return `Photographer có giá cao nhất là ID ${mostExpensive.photographer_id} với ${mostExpensive.price_per_hour.toLocaleString('vi-VN')}đ/giờ. ${mostExpensive.bio || ''}`;
//     }

//     if (lowerQuery.includes('rẻ nhất') || lowerQuery.includes('giá thấp nhất')) {
//       const cheapest = photographers.reduce((min, p) => 
//         p.price_per_hour < min.price_per_hour ? p : min
//       );
//       return `Photographer có giá thấp nhất là ID ${cheapest.photographer_id} với ${cheapest.price_per_hour.toLocaleString('vi-VN')}đ/giờ. ${cheapest.bio || ''}`;
//     }

//     if (lowerQuery.includes('kinh nghiệm nhất') || lowerQuery.includes('lâu năm nhất')) {
//       const mostExperienced = photographers.reduce((max, p) => 
//         p.experience_years > max.experience_years ? p : max
//       );
//       return `Photographer có kinh nghiệm nhất là ID ${mostExperienced.photographer_id} với ${mostExperienced.experience_years} năm kinh nghiệm. ${mostExperienced.bio || ''}`;
//     }

//     // Search for photographers
//     const results = searchPhotographers(query);
    
//     if (results.length === 0) {
//       return 'Không tìm thấy photographer nào phù hợp với yêu cầu của bạn. Bạn có thể thử tìm với tiêu chí khác.';
//     }

//     if (results.length === 1) {
//       const p = results[0];
//       return `Tìm thấy 1 photographer phù hợp:

// 📸 **Photographer ID ${p.photographer_id}**
// 💰 Giá: ${p.price_per_hour.toLocaleString('vi-VN')}đ/giờ
// ⭐ Đánh giá: ${p.average_rating}/5 (${p.review_count} reviews)
// 📅 Kinh nghiệm: ${p.experience_years} năm
// 🏷️ Chuyên môn: ${p.tags.join(', ')}
// 📝 Mô tả: ${p.bio || 'Chưa có mô tả'}
// 📈 Tổng booking: ${p.total_bookings}`;
//     }

//     // Multiple results
//     let response = `Tìm thấy ${results.length} photographer phù hợp:\n\n`;
//     results.slice(0, 5).forEach((p, index) => {
//       response += `${index + 1}. **ID ${p.photographer_id}** - ${p.price_per_hour.toLocaleString('vi-VN')}đ/giờ\n`;
//       response += `   ⭐ ${p.average_rating}/5 | 📅 ${p.experience_years} năm | 🏷️ ${p.tags.slice(0, 2).join(', ')}\n`;
//       response += `   📝 ${p.bio ? p.bio.substring(0, 80) + '...' : 'Chưa có mô tả'}\n\n`;
//     });

//     if (results.length > 5) {
//       response += `... và ${results.length - 5} photographer khác.`;
//     }

//     return response;
//   };

//   const handleSendMessage = () => {
//     if (!inputText.trim()) return;

//     setLoading(true);
//     const userMessage: Message = {
//       id: Date.now(),
//       type: 'user',
//       content: inputText
//     };

//     setMessages(prev => [...prev, userMessage]);

//     // Simulate processing time
//     setTimeout(() => {
//       const botResponse: Message = {
//         id: Date.now() + 1,
//         type: 'bot',
//         content: generateResponse(inputText)
//       };
//       setMessages(prev => [...prev, botResponse]);
//       setLoading(false);
//     }, 1000);

//     setInputText('');
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const suggestedQueries = [
//     "Tìm photographer chụp ảnh cưới",
//     "Photographer dưới 400k",
//     "Photographer có kinh nghiệm trên 3 năm",
//     "Tìm photographer chụp ảnh gia đình",
//     "Photographer nào đắt nhất?"
//   ];

//   return (
//     <div className="max-w-4xl mx-auto h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
//       {/* Header */}
//       <div className="bg-white shadow-lg p-4 border-b">
//         <div className="flex items-center gap-3">
//           <div className="bg-blue-500 p-2 rounded-full">
//             <Camera className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-gray-800">Photographer Finder Bot</h1>
//             <p className="text-sm text-gray-600">Tìm kiếm photographer phù hợp với nhu cầu của bạn</p>
//           </div>
//         </div>
//       </div>

//       {/* Suggested Queries */}
//       <div className="p-4 bg-white border-b">
//         <p className="text-sm text-gray-600 mb-2">Câu hỏi gợi ý:</p>
//         <div className="flex flex-wrap gap-2">
//           {suggestedQueries.map((query, index) => (
//             <button
//               key={index}
//               onClick={() => setInputText(query)}
//               className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
//             >
//               {query}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
//             <div className={`flex items-start gap-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
//               <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-blue-500' : 'bg-gray-600'}`}>
//                 {message.type === 'user' ? 
//                   <User className="w-4 h-4 text-white" /> : 
//                   <Bot className="w-4 h-4 text-white" />
//                 }
//               </div>
//               <div className={`p-3 rounded-lg ${
//                 message.type === 'user' 
//                   ? 'bg-blue-500 text-white rounded-br-none' 
//                   : 'bg-white text-gray-800 rounded-bl-none shadow-md'
//               }`}>
//                 <div className="whitespace-pre-wrap text-sm">{message.content}</div>
//               </div>
//             </div>
//           </div>
//         ))}
//         {loading && (
//           <div className="flex justify-start">
//             <div className="flex items-start gap-3">
//               <div className="p-2 rounded-full bg-gray-600">
//                 <Bot className="w-4 h-4 text-white" />
//               </div>
//               <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-md">
//                 <div className="flex space-x-1">
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Input */}
//       <div className="p-4 bg-white border-t">
//         <div className="flex gap-2">
//           <textarea
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Hỏi về photographer... (VD: Tìm photographer chụp ảnh cưới dưới 500k)"
//             className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows={2}
//             disabled={loading}
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={loading || !inputText.trim()}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PhotographerChatbot;


export default function ChatBot() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      hello
    </div>
  );
}
