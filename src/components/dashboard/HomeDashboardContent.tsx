// import Link from "next/link";
// import { RocketHeader } from "@/components/rocket/Header";
// import { RocketSidebar } from "@/components/rocket/Sidebar";
// import { RocketCard } from "@/components/rocket/Card";
// import { RocketChatWidget } from "@/components/rocket/ChatWidget";
// import { getAsset } from "@/utils/getAsset";

// export function EmployeeRocketDashboard({ clients, employee }: any) {
  
//   return (
//     <>
//       <RocketHeader employee={employee}/>
//       <div className="wrapper">
//          <RocketSidebar clients={clients} employee={employee} />
//         <div className="content-employee">
//         <div className="title">Velkommen til Rocket!</div>
//         <div className="subtitle">
//           Velg en kunde under for raske snarveier.
//         </div>

//         <div className="grid">
//           <RocketCard title="Ads">
//             <Link href="https://ads.facebook.com" target="_blank">
//               <div className="item">
//                 <img src={getAsset("images/meta_ads-icon.png")} alt="" />
//                 Meta Ads
//               </div>
//             </Link>

//             <Link href="https://ads.google.com" target="_blank">
//               <div className="item">
//                 <img src={getAsset("images/google_ads-icon.png")} alt="" />
//                 Google Ads
//               </div>
//             </Link>

//             <Link href="https://www.readpeak.com" target="_blank">
//               <div className="item">
//                 <img src={getAsset("images/readpeak-icon.png")} alt="" />
//                 Readpeak
//               </div>
//             </Link>

//             <Link href="https://adnuntius.com" target="_blank">
//               <div className="item">
//                 <img src={getAsset("images/adnuntius-icon.png")} alt="" />
//                 Adnuntius
//               </div>
//             </Link>
//           </RocketCard>

//           <RocketCard title="Analytics">
//             <Link href="https://matomo.org/" target="_blank">
//               <div className="item">
//                 <img src={getAsset("images/matomo-icon.png")} alt="" />
//                 Matomo
//               </div>
//             </Link>

//             <Link
//               href="https://developers.google.com/analytics"
//               target="_blank"
//             >
//               <div className="item">
//                 <img
//                   src={getAsset("images/google-analytics-icon.png")}
//                   alt=""
//                 />
//                 Google Analytics
//               </div>
//             </Link>

//             <Link href="https://www.semrush.com/" target="_blank">
//               <div className="item">
//                 <img src={getAsset("images/semrush-icon.png")} alt="" />
//                 SEMrush
//               </div>
//             </Link>

//             <Link
//               href="https://developers.google.com/analytics"
//               target="_blank"
//             >
//               <div className="item">
//                 <img
//                   src={getAsset("images/google-analytics-icon.png")}
//                   alt=""
//                 />
//                 GA4 Dashboard
//               </div>
//             </Link>
//           </RocketCard>
//         </div>

//         <div className="grid-3">
//           <RocketCard title="Sales">
//             <Link href="https://www.pipedrive.com" target="_blank">
//               <div className="item">
//                 <img src={getAsset("images/pipedrive-icon.png")} alt="" />
//                 Pipedrive
//               </div>
//             </Link>
//             <Link href="https://www.apollo.io" target="_blank">
//               <div className="item">
//                 <img src={getAsset("images/apollo-icon.png")} alt="" />
//                 Apollo
//               </div>
//             </Link>
//             <Link href="https://www.hubspot.com" target="_blank">
//               <div className="item">
//                 <img src={getAsset("images/hubspot-icon.png")} alt="" />
//                 Hubspot
//               </div>
//             </Link>
//           </RocketCard>

//           <RocketCard title="Comms" vertical>
//             <Link href="https://slack.com" target="_blank">
//               <div className="item">
//                 <img src={getAsset("images/slack-icon.png")} alt="Slack" />
//                 Slack
//               </div>
//             </Link>
//             <Link href="https://www.e-post.no" target="_blank">
//               <div className="item">
//                 <img src={getAsset("images/e-post-icon.png")} alt="E-post" />
//                 E-post
//               </div>
//             </Link>
//           </RocketCard>

//           <RocketCard title="Ai Tools" vertical>
//             <Link href="https://chat.openai.com" target="_blank">
//               <div className="item">
//                 <img
//                   src={getAsset("images/chatgpt-icon.png")}
//                   alt="ChatGPT"
//                 />
//                 ChatGPT
//               </div>
//             </Link>
//             <Link href="https://www.midjourney.com" target="_blank">
//               <div className="item">
//                 <img
//                   src={getAsset("images/midjourney-icon.png")}
//                   alt="Midjourney"
//                 />
//                 Midjourney
//               </div>
//             </Link>
//             <Link href="https://www.dalle.com" target="_blank">
//               <div className="item">
//                 <img
//                   src={getAsset("images/chatgpt-icon.png")}
//                   alt="DALL-E"
//                 />
//                 DALL-E
//               </div>
//             </Link>
//           </RocketCard>
//         </div>

//         <div className="favorites">
//           <h3>Mine Favoritter</h3>
//           <div className="favorite-links">
//             <Link href="https://ads.google.com" target="_blank">
//               <div className="item">
//                 <img
//                   src={getAsset("images/google_ads-icon.png")}
//                   alt="Google Ads"
//                 />
//                 Google Ads
//               </div>
//             </Link>
//             <Link href="https://matomo.org" target="_blank">
//               <div className="item">
//                 <img
//                   src={getAsset("images/matomo-icon.png")}
//                   alt="Matomo"
//                 />
//                 Matomo Dashboard
//               </div>
//             </Link>
//             <Link href="https://slack.com" target="_blank">
//               <div className="item">
//                 <img
//                   src={getAsset("images/slack-icon.png")}
//                   alt="Slack"
//                 />
//                 Slack Channel
//               </div>
//             </Link>
//           </div>
//         </div>
//         </div>
//         <RocketChatWidget />
//       </div>
//     </>
//   );
// }

