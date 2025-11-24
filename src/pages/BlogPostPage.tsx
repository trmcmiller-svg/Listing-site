import { Link, useParams } from "react-router-dom";

const MOCK_BLOG_POSTS = [
  {
    id: "1",
    title: "5 Simple Beauty Upgrades You Can Make Right Now",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&h=400&fit=crop",
    category: "Beauty",
    author: "Just Gorge Team",
    date: "March 15, 2025",
    content: `
      <p class="mb-4 leading-relaxed">
        Looking for ways to refresh your look without a complete overhaul? Sometimes, the simplest changes can make the biggest difference. Here are five easy beauty upgrades you can make right now to feel more confident and radiant.
      </p>
      <h3 class="text-xl font-bold mb-3">1. Hydrate, Hydrate, Hydrate!</h3>
      <p class="mb-4 leading-relaxed">
        It sounds basic, but proper hydration is the foundation of glowing skin. Drink plenty of water throughout the day, and consider adding a hydrating serum with hyaluronic acid to your skincare routine. You'll notice a plumper, more youthful complexion almost immediately.
      </p>
      <h3 class="text-xl font-bold mb-3">2. Master the Art of the Brow</h3>
      <p class="mb-4 leading-relaxed">
        Well-groomed eyebrows frame your face and can instantly lift your entire look. Whether you prefer a natural, bushy brow or a more defined arch, investing in a good brow gel, pencil, or even a professional brow lamination can make a world of difference.
      </p>
      <h3 class="text-xl font-bold mb-3">3. Embrace a Pop of Color</h3>
      <p class="mb-4 leading-relaxed">
        A vibrant lipstick or a subtle blush can instantly brighten your face. Don't be afraid to experiment with new shades that complement your skin tone. A little color can go a long way in making you look more awake and put-together.
      </p>
      <h3 class="text-xl font-bold mb-3">4. Invest in a Quality SPF</h3>
      <p class="mb-4 leading-relaxed">
        Sun protection isn't just for beach days. Daily use of a broad-spectrum SPF is crucial for preventing premature aging, sun spots, and skin damage. Make it a non-negotiable step in your morning routine, even on cloudy days.
      </p>
      <h3 class="text-xl font-bold mb-3">5. Consider a Mini-Treatment</h3>
      <p class="mb-4 leading-relaxed">
        Sometimes, a professional touch is all you need. A quick facial, a light chemical peel, or a subtle injectable like Botox can provide noticeable improvements with minimal downtime. Consult with a verified provider on Just Gorge to find the perfect mini-treatment for you.
      </p>
      <p class="mt-6 leading-relaxed italic">
        Ready to explore more beauty tips and find the right aesthetic provider for your needs? Browse our directory of verified experts on Just Gorge today!
      </p>
    `,
  },
  {
    id: "2",
    title: "4 Things To Avoid After Treatment With Jeuveau®",
    image: "https://images.unsplash.com/photo-1590487988256-93e4d966629b?w=400&h=250&fit=crop",
    category: "Injectables",
    author: "Dr. Sarah Johnson",
    date: "March 10, 2025",
    content: `
      <p class="mb-4 leading-relaxed">
        So, you've just had your Jeuveau® treatment – congratulations on taking a step towards a smoother, more refreshed look! To ensure you get the best possible results and avoid any complications, it's crucial to follow post-treatment care instructions. Here are four key things you should definitely avoid after your Jeuveau® injection.
      </p>
      <h3 class="text-xl font-bold mb-3">1. Don't Rub or Massage the Treated Area</h3>
      <p class="mb-4 leading-relaxed">
        This is perhaps the most important rule. For at least 24 hours after your injection, avoid rubbing, massaging, or applying any significant pressure to the treated areas. Doing so can cause the Jeuveau® to spread to unintended muscles, leading to unwanted side effects like drooping eyelids or uneven results. Be gentle when washing your face or applying skincare products.
      </p>
      <h3 class="text-xl font-bold mb-3">2. Avoid Strenuous Exercise</h3>
      <p class="mb-4 leading-relaxed">
        Hold off on intense workouts, heavy lifting, or any activities that significantly increase your heart rate and blood flow for at least 24-48 hours. Increased blood flow can potentially diffuse the Jeuveau® from the injection site, reducing its effectiveness and increasing the risk of bruising. Light activities like walking are generally fine, but consult your provider for specific recommendations.
      </p>
      <h3 class="text-xl font-bold mb-3">3. Steer Clear of Alcohol and Blood Thinners</h3>
      <p class="mb-4 leading-relaxed">
        For at least 24 hours before and after your treatment, it's best to avoid alcohol and certain blood-thinning medications (like aspirin, ibuprofen, and certain supplements) unless medically necessary and approved by your doctor. These substances can increase your risk of bruising and swelling at the injection sites.
      </p>
      <h3 class="text-xl font-bold mb-3">4. Don't Lie Down for Several Hours</h3>
      <p class="mb-4 leading-relaxed">
        After your Jeuveau® treatment, try to remain upright for at least 4-6 hours. Lying down too soon can also contribute to the spread of the neurotoxin to unintended areas, similar to rubbing the treated site. Plan your day accordingly so you can stay vertical for the recommended period.
      </p>
      <p class="mt-6 leading-relaxed italic">
        Always remember to follow your provider's specific post-treatment instructions, as they are tailored to your individual needs. If you have any concerns or questions, don't hesitate to contact your Just Gorge provider.
      </p>
    `,
  },
  // Add other mock posts here
];


export const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const post = MOCK_BLOG_POSTS.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">The article you are looking for does not exist.</p>
          <Link to="/blog" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/blog" className="text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-8">
          <span className="text-xl">←</span> Back to Blog
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 text-lg mb-4">
            By <span className="font-semibold">{post.author}</span> • {post.date} • <span className="uppercase">{post.category}</span>
          </p>
        </div>

        <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-8">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">Share this article:</p>
          <div className="flex justify-center gap-4">
            <button className="p-3 bg-blue-500 text-white rounded-full">f</button>
            <button className="p-3 bg-blue-400 text-white rounded-full">t</button>
            <button className="p-3 bg-gray-700 text-white rounded-full">in</button>
          </div>
        </div>
      </div>
    </div>
  );
};
