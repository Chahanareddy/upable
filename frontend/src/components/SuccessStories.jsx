import './SuccessStories.css';
import aylin from "./Linkedin-pics/aylin.jpg";
import jasper from "./Linkedin-pics/jasper.jpg";
import carlos from "./Linkedin-pics/carlos.jpg";
import sara from "./Linkedin-pics/sara.jpg";
import liam from "./Linkedin-pics/liam.jpg";
import fatima from "./Linkedin-pics/fatima.jpg";
import noah from "./Linkedin-pics/noah.jpg";
import mai from "./Linkedin-pics/mai.jpg";
import ahmed from "./Linkedin-pics/ahmed.jpg";
import emily from "./Linkedin-pics/emily.jpg";

const stories = [
  {
    name: "Aylin Kaya",
    country: "Turkey",
    disability: "Autism Spectrum Disorder",
    from: "Retail Cashier",
    to: "UX Designer",
    linkedin: href="https://linkedin.com/in/aylinkaya",
    img: aylin,
    description: "Upable helped me turn my passion for design into a career. Feel free to reach out if you're on the same path!"
  },
  {
    name: "Jasper Liu",
    country: "Taiwan",
    disability: "ADHD",
    from: "Data Entry Clerk",
    to: "Business Analyst",
    linkedin: href="https://linkedin.com/in/jasperliu",
    img: jasper,
    description: "From scattered thoughts to structured insights — Upable gave me tools and mentorship that changed everything."
  },
  {
    name: "Carlos Mendes",
    country: "Brazil",
    disability: "Dyslexia",
    from: "Customer Service Rep",
    to: "QA Tester",
    linkedin: href="https://linkedin.com/in/carlosmendes",
    img: carlos,
    description: "Dyslexia didn’t stop me, and it shouldn’t stop you. I'm open to mentorship chats anytime!"
  },
  {
    name: "Sara Novak",
    country: "Croatia",
    disability: "Autism",
    from: "Library Assistant",
    to: "Software Developer",
    linkedin: href="https://linkedin.com/in/saranovak",
    img: sara,
    description: "Coding clicked for me in a way nothing else had. Upable saw that and gave me structure. Let’s connect!"
  },
  {
    name: "Liam O'Reilly",
    country: "Ireland",
    disability: "ADHD",
    from: "Warehouse Worker",
    to: "Marketing Coordinator",
    linkedin: href="https://linkedin.com/in/liamoreilly",
    img: liam,
    description: "Structure and creative freedom together? It’s possible. Grateful to Upable for the roadmap."
  },
  {
    name: "Fatima Noor",
    country: "Pakistan",
    disability: "Dyscalculia",
    from: "Receptionist",
    to: "HR Specialist",
    linkedin: href="https://linkedin.com/in/fatimanoor",
    img: fatima,
    description: "Numbers never made sense — but people always did. Upable helped me find the right path."
  },
  {
    name: "Noah Smith",
    country: "USA",
    disability: "Autism Spectrum",
    from: "Janitor",
    to: "Technical Support",
    linkedin: href="https://linkedin.com/in/noahsmith",
    img: noah,
    description: "Technical support is where I thrive. Let me know if I can help you start too!"
  },
  {
    name: "Mai Tanaka",
    country: "Japan",
    disability: "ADHD",
    from: "Factory Worker",
    to: "Digital Illustrator",
    linkedin: href="https://linkedin.com/in/maitanaka",
    img: mai,
    description: "Upable gave me a way to turn creativity into a career. Happy to share tips or portfolio reviews!"
  },
  {
    name: "Ahmed Zidan",
    country: "Egypt",
    disability: "Dyslexia",
    from: "Security Guard",
    to: "Cybersecurity Analyst",
    linkedin: href="https://linkedin.com/in/ahmedzidan",
    img: ahmed,
    description: "I struggled with reading, not with thinking. Cybersecurity made sense, and Upable helped me prove it."
  },
  {
    name: "Emily Chan",
    country: "Singapore",
    disability: "Autism Spectrum",
    from: "Fast Food Worker",
    to: "Administrative Assistant",
    linkedin: href="https://linkedin.com/in/emilychan",
    img: emily,
    description: "Admin work fits my strengths. Feel free to contact me for mentorship or to view my portfolio!"
  }
];

function SuccessStories() {
  return (
    <div className="success-container">
      <h2 className="section-title">🌟 Success Stories</h2>

      {stories.map((story, index) => (
        <div className="story-card" key={index}>
          <img src={story.img} alt={story.name} className="profile-img" />
          <div className="story-content">
            <h4>{story.name}</h4>
            <p><strong>Country:</strong> {story.country}</p>
            <p><strong>Disability:</strong> {story.disability}</p>
            <p><strong>From:</strong> {story.from}</p>
            <p><strong>To:</strong> {story.to}</p>
            <p className="desc">“{story.description}”</p>
            <a href={story.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SuccessStories;