import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaClock } from "react-icons/fa";
import { Sidebar } from "../layout/Sidebar";
import { useDashboard } from "../../hooks/useDashboard";
import type { Story } from "../../types/dashboard";

// Get relevant image based on story content (same logic as FeaturedStories)
const getStoryImage = (story: { title: string; category: string; summary: string }): string => {
  // Combine all text fields for comprehensive keyword matching
  const searchText = `${story.title} ${story.summary} ${story.category}`.toLowerCase();
  const categoryLower = story.category.toLowerCase();
  
  // Priority: Check category first for specific images
  if (categoryLower === "transportation") {
    return "https://www.planetizen.com/files/styles/featured_large/public/images/AdobeStock_526626797_Editorial_Use_Only.jpeg.webp?itok=umgtH5G-";
  }
  
  if (categoryLower === "environment") {
    return "https://www.americasquarterly.org/wp-content/uploads/2014/01/Midtown-BirdsEye_cropped.jpg";
  }
  
  // Subway/Transit specific
  if (searchText.includes("subway") || searchText.includes("metro") || searchText.includes("train") || 
      searchText.includes("congestion pricing") || (searchText.includes("midtown") && searchText.includes("transit"))) {
    return "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format";
  }
  
  // Bus/Public Transit
  if (searchText.includes("bus") || searchText.includes("public transit") || searchText.includes("transit proposal")) {
    return "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop&auto=format";
  }
  
  // Bike lanes/Cycling
  if (searchText.includes("bike") || searchText.includes("cycling") || searchText.includes("bicycle")) {
    return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format";
  }
  
  // Transportation/Transit general
  if (searchText.includes("transit") || searchText.includes("transportation") || searchText.includes("traffic")) {
    return "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format";
  }
  
  // Green roofs/Sustainability specific
  if (searchText.includes("green roof") || searchText.includes("sustainability guidelines") || 
      searchText.includes("carbon emissions") || searchText.includes("green roof incentives")) {
    return "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop&auto=format";
  }
  
  // Climate/Environment
  if (searchText.includes("climate") || searchText.includes("environment") || searchText.includes("sustainability") || 
      searchText.includes("green") || searchText.includes("eco")) {
    return "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop&auto=format";
  }
  
  // Housing/Affordability
  if (searchText.includes("housing") || searchText.includes("affordability") || searchText.includes("zoning") || 
      searchText.includes("tenant") || searchText.includes("real estate") || searchText.includes("development")) {
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&auto=format";
  }
  
  // Education/Schools
  if (searchText.includes("education") || searchText.includes("school") || searchText.includes("learning") || 
      searchText.includes("student") || searchText.includes("district")) {
    return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&auto=format";
  }
  
  // Health/Healthcare
  if (searchText.includes("health") || searchText.includes("healthcare") || searchText.includes("medical") || 
      searchText.includes("hospital")) {
    return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&auto=format";
  }
  
  // Public Safety/Police
  if (searchText.includes("safety") || searchText.includes("police") || searchText.includes("security") || 
      searchText.includes("crime")) {
    return "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop&auto=format";
  }
  
  // Parks/Recreation
  if (searchText.includes("park") || searchText.includes("recreation") || searchText.includes("outdoor") || 
      searchText.includes("playground")) {
    return "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format";
  }
  
  // Budget/Finance/Economic
  if (searchText.includes("budget") || searchText.includes("finance") || searchText.includes("tax") || 
      searchText.includes("economic") || searchText.includes("funding")) {
    return "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&auto=format";
  }
  
  // Technology/Digital/Innovation
  if (searchText.includes("technology") || searchText.includes("digital") || searchText.includes("tech") || 
      searchText.includes("innovation") || searchText.includes("smart")) {
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&auto=format";
  }
  
  // Community/Social/Neighborhood
  if (searchText.includes("community") || searchText.includes("social") || searchText.includes("neighborhood") || 
      searchText.includes("civic")) {
    return "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop&auto=format";
  }
  
  // Infrastructure/Construction
  if (searchText.includes("infrastructure") || searchText.includes("construction") || searchText.includes("building") || 
      searchText.includes("road") || searchText.includes("bridge")) {
    return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&auto=format";
  }
  
  // Sanitation
  if (searchText.includes("sanitation") || searchText.includes("waste") || searchText.includes("trash") || 
      searchText.includes("garbage")) {
    return "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&h=600&fit=crop&auto=format";
  }
  
  // Water/Resiliency
  if (searchText.includes("water") || searchText.includes("resiliency") || searchText.includes("coastal") || 
      searchText.includes("flood")) {
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format";
  }
  
  // Elections/Voting
  if (searchText.includes("election") || searchText.includes("voting") || searchText.includes("ballot") || 
      searchText.includes("proposition")) {
    return "https://images.unsplash.com/photo-1540914124281-342587941389?w=800&h=600&fit=crop&auto=format";
  }
  
  // Default: NYC cityscape
  return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&auto=format";
};

// Check if image URL is a placeholder that should be replaced (same as FeaturedStories)
const isPlaceholderImage = (url?: string): boolean => {
  if (!url) return true;
  const placeholderPatterns = [
    "placehold.co",
    "placeholder",
    "via.placeholder.com",
    "dummyimage.com"
  ];
  return placeholderPatterns.some(pattern => url.toLowerCase().includes(pattern));
};

// Mock full story content - significantly expanded with lots of information
const getMockStoryContent = (story: Story): string => {
  const category = story.category.toLowerCase();
  const title = story.title.toLowerCase();

  if (category === "transportation" || title.includes("transit")) {
    return `
      <p class="mb-6 text-lg leading-relaxed">The New York City Department of Transportation has unveiled a comprehensive transit proposal that will significantly impact Midtown Manhattan's transportation infrastructure. This initiative represents one of the most ambitious urban mobility projects in the city's recent history, with an estimated budget of $2.4 billion over the next five years.</p>
      
      <p class="mb-6 leading-relaxed">Mayor Eric Adams, in a joint announcement with Transportation Commissioner Ydanis Rodriguez, emphasized that this proposal addresses critical infrastructure needs while positioning New York City as a leader in sustainable urban transportation. "This isn't just about moving people from point A to point B," Adams stated. "It's about creating a transportation system that serves all New Yorkers, reduces our carbon footprint, and supports economic growth."</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Key Changes to Subway Lines</h2>
      <p class="mb-4 leading-relaxed">The proposal includes major upgrades to the 1, 2, 3, N, Q, R, and W lines that serve Midtown. These improvements will involve comprehensive modernization efforts that touch nearly every aspect of the subway experience.</p>
      
      <p class="mb-4 leading-relaxed">The Metropolitan Transportation Authority (MTA) has committed to extending operating hours during peak times, with trains running every 2-3 minutes during morning and evening rush hours. This represents a 15% increase in service frequency compared to current schedules. The enhanced service will particularly benefit commuters traveling from Brooklyn and Queens into Midtown.</p>
      
      <p class="mb-4 leading-relaxed">New express service options will be introduced on several lines, allowing commuters to bypass local stops and reduce travel time by up to 20 minutes for longer journeys. The 2 and 3 lines will see new express patterns during peak hours, while the N and Q lines will have enhanced express service to better serve the growing population in Astoria and Long Island City.</p>
      
      <p class="mb-4 leading-relaxed">Accessibility improvements are a cornerstone of this proposal. Fifteen stations throughout Midtown will receive comprehensive accessibility upgrades, including:</p>
      <ul class="list-disc list-inside mb-6 space-y-3 ml-6 leading-relaxed">
        <li>New elevators and escalators at Times Square-42nd Street, Grand Central-42nd Street, and Herald Square stations</li>
        <li>Wheelchair-accessible platforms with tactile warning strips</li>
        <li>Audio announcements in multiple languages</li>
        <li>Improved wayfinding systems for visually impaired passengers</li>
        <li>Real-time elevator status information via mobile apps</li>
      </ul>
      
      <p class="mb-4 leading-relaxed">Real-time digital signage improvements will be rolled out across all Midtown stations, providing passengers with accurate arrival times, service alerts, and connection information. The new system will use advanced predictive algorithms to provide more accurate arrival predictions, reducing wait times and improving the overall commuter experience.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Bus Route Modifications</h2>
      <p class="mb-4 leading-relaxed">City planners have identified several bus routes that will be restructured to better serve the growing population in Manhattan's busiest district. The M5, M7, M20, and M104 routes will see significant changes designed to improve reliability and reduce travel times.</p>
      
      <p class="mb-4 leading-relaxed">The M5 route, which runs along 5th Avenue, will receive dedicated bus lanes for the entire length of its Midtown segment. These lanes will be operational 24/7, with enhanced enforcement to prevent unauthorized vehicles from blocking bus traffic. Similar improvements will be implemented on 6th Avenue for the M7 route.</p>
      
      <p class="mb-4 leading-relaxed">Bus frequency will increase dramatically during rush hours, with buses arriving every 3-4 minutes during peak times. Off-peak service will also see improvements, with buses running every 8-10 minutes instead of the current 12-15 minute intervals. This represents a 30% increase in overall service capacity.</p>
      
      <p class="mb-4 leading-relaxed">Improved connections to subway stations will be a key focus, with new bus stops positioned closer to subway entrances and improved pedestrian pathways. The M20 route, which serves the West Side, will have new stops at key transfer points including the 1/2/3 line at Times Square and the A/C/E line at Port Authority.</p>
      
      <p class="mb-4 leading-relaxed">Enhanced bus shelters will feature real-time arrival information, USB charging ports, and improved lighting for safety. The shelters will also include weather protection and seating for up to 12 passengers. All shelters will be equipped with accessibility features including wheelchair-accessible boarding areas.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Congestion Pricing Impact</h2>
      <p class="mb-4 leading-relaxed">The transit proposal is closely tied to the city's congestion pricing initiative, which is set to begin implementation in 2025. Revenue from congestion pricing will fund approximately 40% of the proposed transit improvements, creating a sustainable funding model for public transportation that doesn't rely solely on fare revenue or city taxes.</p>
      
      <p class="mb-4 leading-relaxed">The congestion pricing program will charge vehicles entering Manhattan below 60th Street, with fees ranging from $9 to $23 depending on vehicle type and time of day. Trucks and commercial vehicles will face higher fees, while low-income residents and certain essential workers may qualify for discounts or exemptions.</p>
      
      <p class="mb-4 leading-relaxed">Projections indicate that congestion pricing will generate approximately $1 billion annually, with a significant portion dedicated to transit improvements. This funding will be used to accelerate the timeline for subway and bus improvements, allowing the city to complete projects that might otherwise take a decade or more.</p>
      
      <p class="mb-4 leading-relaxed">The relationship between congestion pricing and transit improvements is designed to create a positive feedback loop: better public transportation will encourage more people to use transit instead of driving, which will reduce congestion and generate more revenue for further improvements.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Economic Impact and Job Creation</h2>
      <p class="mb-4 leading-relaxed">The transit proposal is expected to create approximately 15,000 jobs over the next five years, including construction workers, engineers, project managers, and support staff. These jobs will provide opportunities for local residents, with the city committing to ensuring that at least 30% of new hires come from communities that have historically been underrepresented in the construction and transportation sectors.</p>
      
      <p class="mb-4 leading-relaxed">Local businesses are expected to benefit from improved transit access, with studies suggesting that better public transportation can increase foot traffic to retail establishments by 15-20%. Restaurants, shops, and service providers in Midtown are particularly optimistic about the potential for increased customer visits.</p>
      
      <p class="mb-4 leading-relaxed">The construction phase will require coordination with local businesses to minimize disruptions. The city has established a Business Interruption Fund to provide financial assistance to small businesses that experience significant impacts during construction. This fund will offer grants of up to $50,000 to help businesses maintain operations during transit improvements.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Environmental Benefits</h2>
      <p class="mb-4 leading-relaxed">The transit improvements are projected to reduce carbon emissions by approximately 200,000 metric tons annually, equivalent to removing 43,000 cars from the road. This reduction will come from increased public transit ridership and decreased reliance on private vehicles.</p>
      
      <p class="mb-4 leading-relaxed">The proposal includes plans to transition the bus fleet to electric vehicles, with a goal of having 50% of buses running on electricity by 2027. This transition will further reduce emissions and improve air quality in Midtown, which has historically struggled with high levels of air pollution.</p>
      
      <p class="mb-4 leading-relaxed">Improved transit options will also reduce noise pollution, as fewer vehicles on the road means less traffic noise. Studies have shown that noise pollution can have significant negative impacts on health, including increased stress levels and sleep disturbances.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Community Response and Public Engagement</h2>
      <p class="mb-4 leading-relaxed">Local business owners and residents have expressed mixed reactions to the proposal. While many welcome the improvements to public transit, concerns have been raised about construction disruptions and potential changes to traffic patterns during the implementation phase.</p>
      
      <p class="mb-4 leading-relaxed">The Midtown Business Association has been actively engaged in discussions with city officials, advocating for measures to minimize construction impacts. "We support the goals of this proposal," said association president Maria Rodriguez, "but we need to ensure that businesses can continue to operate during construction. The city has been responsive to our concerns, and we're working together to develop a comprehensive mitigation plan."</p>
      
      <p class="mb-4 leading-relaxed">Resident groups have organized community meetings to discuss the proposal, with particular focus on accessibility improvements and service frequency. Many residents have expressed excitement about the prospect of more reliable and frequent transit service, while others have raised concerns about potential fare increases to fund the improvements.</p>
      
      <p class="mb-4 leading-relaxed">The city has committed to holding at least 20 public meetings throughout the planning and implementation process, with opportunities for residents to provide input on specific aspects of the proposal. An online portal has been established where residents can submit comments, ask questions, and track the progress of various components of the proposal.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Technology and Innovation</h2>
      <p class="mb-4 leading-relaxed">The proposal includes significant investments in technology to improve the transit experience. New mobile applications will provide real-time information about service status, delays, and alternative routes. The apps will also offer personalized recommendations based on a user's travel patterns and preferences.</p>
      
      <p class="mb-4 leading-relaxed">Contactless payment systems will be expanded throughout the transit system, allowing passengers to use credit cards, mobile payment apps, or transit cards to pay for fares. This will reduce wait times at fare machines and make the system more accessible to tourists and occasional riders.</p>
      
      <p class="mb-4 leading-relaxed">Artificial intelligence will be used to optimize bus and subway schedules based on real-time demand patterns. This will allow the system to respond more quickly to unexpected changes in ridership, reducing overcrowding and improving service reliability.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Safety and Security Improvements</h2>
      <p class="mb-4 leading-relaxed">The proposal includes comprehensive safety improvements, including enhanced lighting at all stations, improved surveillance systems, and increased presence of transit police officers. These measures are designed to make the transit system safer for all passengers, particularly during off-peak hours.</p>
      
      <p class="mb-4 leading-relaxed">Emergency communication systems will be upgraded at all Midtown stations, with direct connections to emergency services and improved cell phone coverage throughout the subway system. This will ensure that passengers can quickly contact help in case of emergencies.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Timeline and Implementation Phases</h2>
      <p class="mb-4 leading-relaxed">The proposal is currently in the public comment phase, with community meetings scheduled throughout the next quarter. The city expects to finalize the proposal by the end of 2024, with implementation beginning in early 2025.</p>
      
      <p class="mb-4 leading-relaxed">The implementation will occur in phases to minimize disruptions. Phase 1, scheduled for 2025, will focus on bus route improvements and accessibility upgrades at five key stations. Phase 2, beginning in 2026, will include subway service enhancements and additional accessibility improvements. Phase 3, starting in 2027, will complete the remaining improvements and begin the transition to electric buses.</p>
      
      <p class="mb-4 leading-relaxed">Each phase will include comprehensive communication campaigns to keep residents and businesses informed about upcoming changes and potential impacts. The city will provide regular updates through multiple channels, including social media, email newsletters, and community meetings.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Funding and Financial Considerations</h2>
      <p class="mb-4 leading-relaxed">The total cost of the proposal is estimated at $2.4 billion over five years. Funding will come from multiple sources: 40% from congestion pricing revenue, 30% from federal transportation grants, 20% from state funding, and 10% from city capital budgets.</p>
      
      <p class="mb-4 leading-relaxed">The city has already secured commitments for federal funding through the Infrastructure Investment and Jobs Act, which provides significant resources for public transportation improvements. State funding has been allocated through the MTA's capital program, which includes dedicated resources for accessibility and service improvements.</p>
      
      <p class="mb-6 leading-relaxed">City officials emphasize that the proposal represents a sound investment in the city's future. "Every dollar we invest in public transportation generates multiple dollars in economic activity," said Transportation Commissioner Rodriguez. "This proposal will make New York City more competitive, more sustainable, and more livable for all residents."</p>
      
      <p class="mb-6 mt-8 leading-relaxed text-lg font-semibold">City officials encourage all residents to participate in the public comment process and attend upcoming town hall meetings to share their feedback on this transformative transit proposal. The future of New York City's transportation system depends on input from the communities it serves.</p>
    `;
  }

  if (category === "environment" || title.includes("sustainability") || title.includes("environment")) {
    return `
      <p class="mb-6 text-lg leading-relaxed">New York City is taking bold steps to address climate change and environmental sustainability through a comprehensive set of new guidelines and regulations. These measures aim to position NYC as a leader in urban environmental policy, with ambitious goals that exceed federal requirements and set new standards for cities worldwide.</p>
      
      <p class="mb-6 leading-relaxed">Mayor Eric Adams, in partnership with the City Council and environmental advocacy groups, has unveiled what he calls "the most comprehensive environmental policy package in the city's history." The regulations, which will be phased in over the next decade, address everything from building emissions to waste management, transportation, and renewable energy.</p>
      
      <p class="mb-6 leading-relaxed">"New York City has always been a leader, and we're not going to wait for others to act on climate change," Adams said in a press conference at City Hall. "These regulations will not only protect our environment but will create thousands of green jobs, reduce energy costs for residents, and make our city more resilient to the impacts of climate change."</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Carbon Emissions Reduction Goals</h2>
      <p class="mb-4 leading-relaxed">The new sustainability guidelines establish ambitious targets to reduce carbon emissions by 40% over the next decade. This represents one of the most aggressive climate action plans in the United States, with specific milestones set for each year through 2034.</p>
      
      <p class="mb-4 leading-relaxed">The city has committed to reducing emissions from buildings, which account for approximately 70% of the city's total carbon footprint. Large buildings (over 25,000 square feet) will be required to reduce their emissions by 40% by 2030 and 80% by 2050. Smaller buildings will face less stringent but still significant requirements.</p>
      
      <p class="mb-4 leading-relaxed">To achieve these goals, the city will implement a carbon trading system that allows building owners to buy and sell emission credits. Buildings that exceed their reduction targets can sell credits to those that struggle to meet requirements, creating a market-based incentive for innovation and efficiency.</p>
      
      <p class="mb-4 leading-relaxed">The emissions reduction plan includes specific targets for different sectors: transportation (30% reduction), waste management (50% reduction in landfill waste), and energy generation (100% renewable energy by 2040). Each sector has detailed implementation plans with specific milestones and accountability measures.</p>
      
      <p class="mb-4 leading-relaxed">The city will track progress through a comprehensive monitoring system that collects data from buildings, vehicles, and waste facilities. This data will be made publicly available through an online dashboard, allowing residents to see the city's progress toward its climate goals in real-time.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Green Roof Incentives Program</h2>
      <p class="mb-4 leading-relaxed">A cornerstone of the new regulations is an expanded green roof incentives program that makes it financially attractive for building owners to install green roofs, solar panels, and other sustainable infrastructure. The program represents a $500 million investment over the next five years.</p>
      
      <p class="mb-4 leading-relaxed">Building owners can now receive tax credits of up to $15 per square foot for green roof installation, with additional credits available for solar panel integration and rainwater collection systems. The credits can be applied against property taxes for up to 10 years, providing significant long-term financial benefits.</p>
      
      <p class="mb-4 leading-relaxed">The program also includes expedited permit processing for sustainable building projects, reducing the typical permit timeline from 6-12 months to 2-4 months. This will make it easier and faster for building owners to implement green infrastructure improvements.</p>
      
      <p class="mb-4 leading-relaxed">Grants are available for retrofitting existing buildings with green infrastructure, with priority given to buildings in low-income neighborhoods and areas with high heat island effects. The grants can cover up to 50% of installation costs, with a maximum grant of $500,000 per building.</p>
      
      <p class="mb-4 leading-relaxed">Technical assistance from city sustainability experts is available to help building owners navigate the application process, design green infrastructure systems, and identify the most cost-effective improvements for their specific buildings. The city has established a team of 25 sustainability specialists to provide this support.</p>
      
      <p class="mb-4 leading-relaxed">Green roofs provide numerous benefits beyond carbon reduction, including reduced heating and cooling costs, improved air quality, stormwater management, and increased property values. Studies have shown that green roofs can reduce building energy costs by 10-30%, providing ongoing financial benefits to building owners.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Building Energy Efficiency Standards</h2>
      <p class="mb-4 leading-relaxed">New mandatory energy efficiency standards will apply to all buildings over 25,000 square feet, affecting approximately 50,000 buildings across the city. These standards represent the most comprehensive building efficiency requirements in the country.</p>
      
      <p class="mb-4 leading-relaxed">Buildings will be required to conduct energy audits every five years, with the first audit due within 18 months of the regulations taking effect. These audits must be conducted by certified energy auditors and include detailed assessments of heating, cooling, lighting, and building envelope systems.</p>
      
      <p class="mb-4 leading-relaxed">Based on audit results, buildings will be required to implement cost-effective energy efficiency improvements. The regulations define "cost-effective" as improvements that pay for themselves through energy savings within 10 years. Common improvements include LED lighting upgrades, high-efficiency HVAC systems, improved insulation, and smart building controls.</p>
      
      <p class="mb-4 leading-relaxed">Mandatory upgrades to heating and cooling systems will be required for buildings with systems older than 15 years. These upgrades must meet or exceed current energy efficiency standards, with financial assistance available for buildings that demonstrate financial hardship.</p>
      
      <p class="mb-4 leading-relaxed">Implementation of smart building technologies will be required for all new construction and major renovations. These technologies include automated lighting and HVAC controls, occupancy sensors, and energy monitoring systems that provide real-time data on energy consumption.</p>
      
      <p class="mb-4 leading-relaxed">Renewable energy integration requirements will mandate that buildings over 50,000 square feet install on-site renewable energy systems (solar panels, wind turbines, or geothermal systems) or purchase renewable energy credits equivalent to 20% of their energy consumption.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Waste Reduction and Recycling</h2>
      <p class="mb-4 leading-relaxed">The guidelines also address waste management, with new requirements for commercial establishments to reduce single-use plastics and increase recycling rates. The city aims to achieve zero waste to landfills by 2030, a goal that requires significant changes in how businesses and residents handle waste.</p>
      
      <p class="mb-4 leading-relaxed">Restaurants and retail businesses will need to transition to compostable or reusable packaging by 2026. Single-use plastic bags, straws, and food containers will be banned, with fines of up to $500 for violations. The city will provide grants and technical assistance to help businesses make this transition.</p>
      
      <p class="mb-4 leading-relaxed">Commercial buildings will be required to implement comprehensive recycling programs, with separate collection for paper, plastic, metal, glass, and organic waste. Buildings that fail to meet recycling targets will face fines and may be required to implement additional waste reduction measures.</p>
      
      <p class="mb-4 leading-relaxed">The city will expand its organic waste collection program to all residential buildings by 2025. This program collects food scraps and other organic materials for composting, reducing the amount of waste sent to landfills and creating valuable compost for parks and community gardens.</p>
      
      <p class="mb-4 leading-relaxed">New requirements for construction and demolition waste will mandate that at least 75% of materials be recycled or reused. This will reduce the environmental impact of construction projects while creating new markets for recycled building materials.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Transportation and Air Quality</h2>
      <p class="mb-4 leading-relaxed">To improve air quality, the city is expanding electric vehicle charging infrastructure and providing incentives for businesses to transition their fleets to electric vehicles. The goal is to have 30% of all city vehicles electric by 2027, and 100% by 2035.</p>
      
      <p class="mb-4 leading-relaxed">The city will install 10,000 new public charging stations over the next five years, with a focus on areas with limited current access. These stations will include fast-charging options that can charge a vehicle in 30 minutes or less, making electric vehicles more practical for city residents.</p>
      
      <p class="mb-4 leading-relaxed">Businesses that transition their delivery fleets to electric vehicles will receive tax credits of up to $7,500 per vehicle, along with grants for installing charging infrastructure. The city estimates that this will result in 5,000 new electric delivery vehicles on city streets by 2027.</p>
      
      <p class="mb-4 leading-relaxed">The regulations also include requirements for reducing idling by commercial vehicles, with increased enforcement and higher fines for violations. Idling vehicles are a significant source of air pollution, particularly in dense urban areas like Midtown Manhattan.</p>
      
      <p class="mb-4 leading-relaxed">The city will implement low-emission zones in areas with high air pollution, restricting access for the most polluting vehicles during peak hours. These zones will be phased in gradually, with advance notice and support for businesses that need to upgrade their vehicles.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Water Management and Resilience</h2>
      <p class="mb-4 leading-relaxed">The regulations include comprehensive water management requirements designed to reduce water consumption, manage stormwater, and protect the city's water supply. Buildings will be required to install water-efficient fixtures and implement rainwater collection systems where feasible.</p>
      
      <p class="mb-4 leading-relaxed">Stormwater management requirements will mandate that new construction and major renovations include green infrastructure to capture and manage stormwater on-site. This will reduce the burden on the city's sewer system and help prevent combined sewer overflows that pollute local waterways.</p>
      
      <p class="mb-4 leading-relaxed">The city will expand its program to protect and restore natural areas that help manage stormwater, including wetlands, parks, and green spaces. These natural areas provide valuable ecosystem services while also improving quality of life for residents.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Community Impact and Equity</h2>
      <p class="mb-4 leading-relaxed">These regulations are expected to create thousands of green jobs in construction, renewable energy, and environmental consulting. The city has committed to ensuring that at least 40% of these jobs go to residents of low-income communities and communities of color.</p>
      
      <p class="mb-4 leading-relaxed">The city has also established a fund to help low-income residents and small businesses comply with the new requirements. This fund will provide grants, low-interest loans, and technical assistance to ensure that the transition to more sustainable practices doesn't create financial hardship.</p>
      
      <p class="mb-4 leading-relaxed">Environmental justice is a key focus of the regulations, with particular attention to communities that have historically borne the brunt of environmental pollution. These communities will receive priority for green infrastructure investments, air quality improvements, and job training programs.</p>
      
      <p class="mb-4 leading-relaxed">The city will work with community organizations to ensure that residents understand the new requirements and have access to resources to help them comply. This includes multilingual outreach, community workshops, and one-on-one assistance for residents who need help navigating the new regulations.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Business Response and Economic Impact</h2>
      <p class="mb-4 leading-relaxed">Environmental advocates have praised the comprehensive nature of these guidelines, while some business groups have raised concerns about implementation costs. The city has committed to providing support and resources to ensure a smooth transition for all stakeholders.</p>
      
      <p class="mb-4 leading-relaxed">The New York City Business Improvement Districts have been working closely with city officials to develop implementation plans that minimize disruption to businesses. "We understand the importance of these regulations," said BID president James Chen, "and we're committed to working with the city to ensure that businesses can comply while remaining competitive."</p>
      
      <p class="mb-4 leading-relaxed">Studies have shown that investments in environmental sustainability can actually improve business competitiveness by reducing operating costs, attracting environmentally conscious customers, and creating new market opportunities. The city estimates that the regulations will generate $3 billion in economic activity over the next decade.</p>
      
      <p class="mb-4 leading-relaxed">The regulations are expected to create a new green economy in New York City, with opportunities in renewable energy installation, energy auditing, green building design, and environmental consulting. The city is working with educational institutions to develop training programs that prepare workers for these new jobs.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Monitoring and Enforcement</h2>
      <p class="mb-4 leading-relaxed">The city will establish a comprehensive monitoring and enforcement system to ensure compliance with the new regulations. This will include regular inspections, data collection, and public reporting on progress toward environmental goals.</p>
      
      <p class="mb-4 leading-relaxed">Buildings that fail to comply with energy efficiency requirements will face fines and may be required to implement additional improvements. However, the city emphasizes that enforcement will focus on education and assistance first, with fines used only as a last resort.</p>
      
      <p class="mb-4 leading-relaxed">A new Office of Environmental Compliance will be established to coordinate enforcement efforts and provide support to building owners and businesses. This office will have a staff of 50 inspectors and compliance specialists, along with resources to help businesses understand and meet the new requirements.</p>
      
      <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">International Leadership and Partnerships</h2>
      <p class="mb-4 leading-relaxed">New York City is positioning itself as a global leader in urban environmental policy, working with other cities around the world to share best practices and coordinate climate action. The city has joined international networks of cities committed to climate action, including C40 Cities and the Global Covenant of Mayors.</p>
      
      <p class="mb-4 leading-relaxed">The regulations align with international climate goals, including the Paris Agreement targets, and demonstrate that cities can take meaningful action on climate change even when national governments are slow to act. This leadership role helps attract international investment and talent to New York City.</p>
      
      <p class="mb-6 mt-8 leading-relaxed text-lg font-semibold">The comprehensive nature of these guidelines represents a significant step forward in New York City's efforts to address climate change and create a more sustainable future. While implementation will require significant effort and investment, the long-term benefits for the environment, economy, and quality of life make this a critical investment in the city's future.</p>
    `;
  }

  // Default content for other categories - also expanded
  return `
    <p class="mb-6 text-lg leading-relaxed">${story.summary}</p>
    
    <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Overview</h2>
    <p class="mb-4 leading-relaxed">This important civic development represents a significant step forward for New York City. The proposal addresses key challenges facing our community and provides a framework for positive change that will benefit residents for generations to come.</p>
    
    <p class="mb-4 leading-relaxed">The initiative has been developed through extensive consultation with community stakeholders, including residents, business owners, advocacy groups, and experts in the field. This collaborative approach ensures that the proposal reflects the diverse needs and perspectives of New York City's communities.</p>
    
    <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Key Details and Implementation</h2>
    <p class="mb-4 leading-relaxed">City officials have worked closely with community stakeholders to develop this comprehensive approach. The initiative includes multiple components designed to address various aspects of the issue, with careful attention to ensuring that implementation is practical and achievable.</p>
    
    <p class="mb-4 leading-relaxed">The proposal includes detailed implementation plans with specific timelines, milestones, and accountability measures. Regular progress reports will be made available to the public, ensuring transparency and allowing residents to track the city's progress toward its goals.</p>
    
    <p class="mb-4 leading-relaxed">Funding for the initiative comes from multiple sources, including city budgets, state and federal grants, and public-private partnerships. This diversified funding approach ensures that the initiative can proceed even if one funding source faces challenges.</p>
    
    <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Impact on Residents</h2>
    <p class="mb-4 leading-relaxed">Residents can expect to see positive changes as this initiative is implemented. The city is committed to transparency and will provide regular updates on progress and outcomes through multiple channels, including community meetings, online portals, and direct communication with residents.</p>
    
    <p class="mb-4 leading-relaxed">The initiative is designed to benefit all residents, with particular attention to ensuring that low-income communities and communities of color receive equitable benefits. Special programs and resources will be available to help these communities participate in and benefit from the initiative.</p>
    
    <p class="mb-4 leading-relaxed">Residents will have multiple opportunities to provide input and feedback throughout the implementation process. The city has established advisory committees, public forums, and online platforms where residents can share their perspectives and concerns.</p>
    
    <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Economic and Social Benefits</h2>
    <p class="mb-4 leading-relaxed">The initiative is expected to create significant economic benefits, including job creation, increased property values, and improved business opportunities. Studies have shown that similar initiatives in other cities have generated substantial economic returns on investment.</p>
    
    <p class="mb-4 leading-relaxed">Social benefits include improved quality of life, better access to services and opportunities, and stronger community connections. The initiative is designed to strengthen neighborhoods and create more vibrant, livable communities throughout New York City.</p>
    
    <h2 class="text-3xl font-bold mb-4 mt-8 text-slate-900">Next Steps and Public Engagement</h2>
    <p class="mb-4 leading-relaxed">The proposal is now open for public comment and community input. City officials encourage all residents to participate in the process and share their perspectives on this important civic matter. Public hearings will be held in each borough, with additional opportunities for online participation.</p>
    
    <p class="mb-4 leading-relaxed">Following the public comment period, the city will review all feedback and make adjustments to the proposal as needed. The final proposal will be presented to the City Council for approval, with implementation beginning shortly after approval is granted.</p>
    
    <p class="mb-6 mt-8 leading-relaxed text-lg font-semibold">This initiative represents an important opportunity to shape the future of New York City. The city encourages all residents to participate in the public engagement process and help create a proposal that serves the best interests of all New Yorkers.</p>
  `;
};

export const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useDashboard();
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    if (data?.stories && id) {
      const foundStory = data.stories.find(s => s.id === id);
      if (foundStory) {
        setStory(foundStory);
      }
    }
  }, [data, id]);

  const getCategoryColor = (category: string) => {
    if (category === "Transit" || category === "Transportation") return "bg-blue-500 text-white";
    if (category === "Environment") return "bg-green-500 text-white";
    return "bg-slate-500 text-white";
  };

  const getCategoryTextColor = (category: string) => {
    if (category === "Transit" || category === "Transportation") return "text-blue-600";
    if (category === "Environment") return "text-green-600";
    return "text-slate-600";
  };

  if (isLoading) {
    return (
      <>
        <Sidebar />
        <div className="flex flex-col h-full overflow-hidden" style={{ marginLeft: "280px", width: "calc(100% - 280px)" }}>
          <main className="flex-1 overflow-y-auto">
            <div className="w-full px-8 py-8">
              <div className="animate-pulse">
                <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="h-64 bg-slate-200 rounded mb-6"></div>
                <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (!story) {
    return (
      <>
        <Sidebar />
        <div className="flex flex-col h-full overflow-hidden" style={{ marginLeft: "280px", width: "calc(100% - 280px)" }}>
          <main className="flex-1 overflow-y-auto">
            <div className="w-full px-8 py-8">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Story Not Found</h1>
                <p className="text-slate-600 mb-6">The story you're looking for doesn't exist.</p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // Use the same image selection logic as FeaturedStories
  const imageUrl = (!story.image_url || isPlaceholderImage(story.image_url))
    ? getStoryImage(story)
    : story.image_url;
  const publishedDate = new Date(story.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <>
      <Sidebar />
      <div className="flex flex-col h-full overflow-hidden" style={{ marginLeft: "280px", width: "calc(100% - 280px)" }}>
        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Featured Story</h1>
                <p className="text-slate-600 mt-1">Read the full article</p>
              </div>
            </div>

            {/* Article Card */}
            <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-96 w-full overflow-hidden bg-slate-100">
                <img
                  src={imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getStoryImage(story);
                  }}
                />
              </div>

              {/* Article Content */}
              <div className="p-8 md:p-12">
                {/* Category and Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(story.category)}`}>
                    {story.category}
                  </span>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>{publishedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <FaClock className="w-4 h-4" />
                    <span>{story.readingTime || "15 min read"}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${getCategoryTextColor(story.category)}`}>
                  {story.title}
                </h2>

                {/* Summary */}
                <p className="text-xl text-slate-600 mb-8 leading-relaxed border-l-4 border-slate-300 pl-6 italic">
                  {story.summary}
                </p>

                {/* Full Article Content - Scrollable */}
                <div
                  className="text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: getMockStoryContent(story) }}
                />
              </div>
            </article>
          </div>
        </main>
      </div>
    </>
  );
};
