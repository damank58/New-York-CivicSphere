import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Story } from "../../types/dashboard";

type Props = {
  stories: Story[];
  isLoading: boolean;
};

// Get relevant image based on story content (title, summary, and category)
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

// Legacy function for backward compatibility (category-only matching)
const getCategoryImage = (category: string): string => {
  return getStoryImage({ title: "", category, summary: "" });
};

// Check if image URL is a placeholder that should be replaced
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

export const FeaturedStories = ({ stories, isLoading }: Props) => {
  // Memoize display stories to prevent unnecessary recalculations
  const displayStories: Story[] = useMemo(() => {
    if (isLoading) {
      const story1 = {
        id: "1",
        title: "How the new transit proposal affects Midtown",
        category: "Transportation",
        summary: "Comprehensive analysis of the proposed changes to subway lines and bus routes in Manhattan's busiest district.",
        readingTime: "8 min read",
        published_at: new Date().toISOString(),
      };
      const story2 = {
        id: "2",
        title: "What's changing with NYC's sustainability guidelines?",
        category: "Environment",
        summary: "New environmental regulations aim to reduce carbon emissions by 40% over the next decade.",
        readingTime: "6 min read",
        published_at: new Date().toISOString(),
      };
      return [
        {
          ...story1,
          image_url: getStoryImage(story1),
        },
        {
          ...story2,
          image_url: getStoryImage(story2),
        }
      ];
    }
    
    return stories.slice(0, 2).map(story => {
      // Always use story-based image if image_url is missing or is a placeholder
      const imageUrl = (!story.image_url || isPlaceholderImage(story.image_url))
        ? getStoryImage(story)
        : story.image_url;
      
      return {
        ...story,
        image_url: imageUrl,
        readingTime: story.readingTime || "5 min read"
      };
    });
  }, [stories, isLoading]);

  const getCategoryColor = (category: string) => {
    if (category === "Transit") return "bg-blue-500 text-white";
    if (category === "Environment") return "bg-green-500 text-white";
    return "bg-slate-500 text-white";
  };

  const getCategoryTextColor = (category: string) => {
    if (category === "Transit") return "text-blue-600";
    if (category === "Environment") return "text-green-600";
    return "text-slate-600";
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Featured Civic Stories</h2>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayStories.map((story) => {
          // Ensure we always have a valid image URL
          const imageUrl = story.image_url || getStoryImage(story);
          
          return (
            <article key={story.id} className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                <img
                  src={imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to story-based image if image fails to load
                    const target = e.target as HTMLImageElement;
                    const fallbackUrl = getStoryImage(story);
                    if (target.src !== fallbackUrl) {
                      target.src = fallbackUrl;
                    }
                  }}
                />
              </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(story.category)}`}>
                  {story.category}
                </span>
                <span className="text-sm text-slate-500">{story.readingTime || "5 min read"}</span>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${getCategoryTextColor(story.category)}`}>
                {story.title}
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                {story.summary}
              </p>
              <Link
                to={`/story/${story.id}`}
                className={`inline-flex items-center text-sm font-semibold hover:underline ${getCategoryTextColor(story.category)}`}
              >
                Read Full Story →
              </Link>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
};

