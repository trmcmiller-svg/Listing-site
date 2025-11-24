import { Link } from "react-router-dom";

const MOCK_BLOG_POSTS = [
  {
    id: "1",
    title: "5 Simple Beauty Upgrades You Can Make Right Now",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&h=400&fit=crop",
    category: "Beauty",
    excerpt: "From your nightly beauty routine to a quick upgrade at home. Or in-office.",
    isHero: true,
  },
  {
    id: "2",
    title: "4 Things To Avoid After Treatment With Jeuveau®",
    image: "https://images.unsplash.com/photo-1590487988256-93e4d966629b?w=400&h=250&fit=crop",
    category: "Injectables",
    excerpt: "Don't. Even. Think About It. Let's go over the scene. You scheduled your Jeuveau® treatment consultation and...",
    isLatest: true,
  },
  {
    id: "3",
    title: "10 Questions To Bring To Your First Appointment With Your Neurotoxin Injector",
    image: "https://images.unsplash.com/photo-1580618672590-b8071956e3e8?w=400&h=250&fit=crop",
    category: "Injectables",
    excerpt: "If you've been quietly considering neurotoxin treatments or other injectables, you're definitely not alone.",
    isLatest: true,
  },
  {
    id: "4",
    title: "So... What Exactly Is Jeuveau®? And What Does It Do?",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=250&fit=crop",
    category: "Injectables",
    excerpt: "As much as we've seen you're meeting this neurotoxin and your friends already swear by neurotoxin injections for their frown lines...",
    isMostPopular: true,
  },
  {
    id: "5",
    title: "Can Facial Yoga Really Help You Look Younger?",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop",
    category: "Beauty",
    excerpt: "How a crash course in facial exercises and how they work through the decades.",
    isMostPopular: true,
  },
  {
    id: "6",
    title: "Growth Mindset To Age Your Way",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=250&fit=crop",
    category: "Beauty",
    excerpt: "The older you get, the more you start to see the truth: everything is black and white.",
    isMostPopular: true,
  },
  {
    id: "7",
    title: "How To Prepare For Sun Exposure — With SPF, Obviously!",
    image: "https://images.unsplash.com/photo-1590487988256-93e4d966629b?w=400&h=250&fit=crop",
    category: "Skin Health",
    excerpt: "It's your nightly beauty routine that could use an upgrade at home. Or in-office.",
  },
  {
    id: "8",
    title: "Overdid It Under The Sun? What's The Best After-Sun Care?",
    image: "https://images.unsplash.com/photo-1580618672590-b8071956e3e8?w=400&h=250&fit=crop",
    category: "Skin Health",
    excerpt: "We've all been there. A little more than we'd like time spending too much time in the sun.",
  },
  {
    id: "9",
    title: "The 6 Most Common Wrinkle Culprits And How To Prevent Them",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=250&fit=crop",
    category: "Skin Health",
    excerpt: "We know, oh we know. Inevitably, there are few unwelcome guests crashing the aging...",
  },
];

const BlogCard = ({ post, size = "default" }: { post: typeof MOCK_BLOG_POSTS[0]; size?: "default" | "hero" | "large" }) => (
  <Link
    to={`/blog/${post.id}`}
    className={`block group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
      size === "hero" ? "col-span-full" : ""
    }`}
  >
    <div className={`relative overflow-hidden ${size === "hero" ? "h-96" : "h-48"}`}>
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {size === "hero" && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end text-white">
          <span className="text-xs uppercase font-semibold mb-2">{post.category}</span>
          <h3 className="text-3xl font-bold mb-2">{post.title}</h3>
          <p className="text-base">{post.excerpt}</p>
          <span className="text-sm uppercase font-semibold mt-3">Read More →</span>
        </div>
      )}
    </div>
    {size !== "hero" && (
      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
      </div>
    )}
  </Link>
);

export const BlogPage = () => {
  const heroPost = MOCK_BLOG_POSTS.find(post => post.isHero);
  const latestPosts = MOCK_BLOG_POSTS.filter(post => post.isLatest && !post.isHero);
  const mostPopularPosts = MOCK_BLOG_POSTS.filter(post => post.isMostPopular && !post.isHero);

  const categories = ["Injectables", "Beauty", "Skin Health"];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {heroPost && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <BlogCard post={heroPost} size="hero" />
        </div>
      )}

      {/* Blog Categories Menu */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex overflow-x-auto gap-6 scrollbar-hide">
            <button className="text-black font-semibold whitespace-nowrap border-b-2 border-black pb-2">
              Home
            </button>
            <button className="text-gray-600 hover:text-black whitespace-nowrap pb-2">
              Latest
            </button>
            <button className="text-gray-600 hover:text-black whitespace-nowrap pb-2">
              Most Popular
            </button>
            {categories.map(category => (
              <button key={category} className="text-gray-600 hover:text-black whitespace-nowrap pb-2">
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Latest Section */}
        {latestPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Latest</h2>
              <Link to="/blog" className="text-sm text-gray-600 hover:underline">SEE MORE</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {latestPosts.map(post => (
                <BlogCard key={post.id} post={post} size="default" />
              ))}
            </div>
          </div>
        )}

        {/* Most Popular Section */}
        {mostPopularPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Most Popular</h2>
              <Link to="/blog" className="text-sm text-gray-600 hover:underline">SEE MORE</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {mostPopularPosts.map(post => (
                <BlogCard key={post.id} post={post} size="default" />
              ))}
            </div>
          </div>
        )}

        {/* Categorized Sections */}
        {categories.map(category => (
          <div key={category} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{category}</h2>
              <Link to="/blog" className="text-sm text-gray-600 hover:underline">SEE MORE</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {MOCK_BLOG_POSTS.filter(post => post.category === category && !post.isHero && !post.isLatest && !post.isMostPopular).map(post => (
                <BlogCard key={post.id} post={post} size="default" />
              ))}
            </div>
          </div>
        ))}

        {/* CTA Banner */}
        <div className="relative bg-gradient-to-r from-pink-500 to-red-600 rounded-xl p-8 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between mt-16">
          <div>
            <h2 className="text-3xl font-bold mb-2">BYE, FROWN LINES.</h2>
            <h2 className="text-3xl font-bold mb-4">HELLO, JEUVEAU!</h2>
          </div>
          <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            JEUVEAU NEAR ME →
          </button>
        </div>
      </div>
    </div>
  );
};
