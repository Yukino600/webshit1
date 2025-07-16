// src/components/About.jsx
import React from "react";
import "./about.css";

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Itsuki",
      role: "Founder & CEO",
      bio: "Passionate about making learning accessible to everyone with innovative educational solutions.",
      image: "/team-images/images(1).jpg"
    },
    {
      id: 2,
      name: "EnderZip",
      role: "Lead Developer",
      bio: "Full-stack developer focused on building user-friendly and scalable learning platforms.",
      image: "/team-images/EnderZip.png"
    },
    {
      id: 3,
      name: "Walter White",
      role: "Head of Curriculum",
      bio: "Expert in creating engaging educational content with a focus on practical application and results.",
      image: "/team-images/Walter_White2.webp"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Students Enrolled" },
    { number: "200+", label: "Courses Available" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About EduElite</h1>
        <p>Empowering learners worldwide with quality education and innovative technology.</p>
      </header>

      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            At EduElite, we believe that quality education should be accessible to everyone, 
            regardless of their location, background, or circumstances. Our mission is to 
            democratize learning by providing world-class courses that help individuals 
            achieve their personal and professional goals.
          </p>
          <p>
            We combine cutting-edge technology with expert instruction to create an 
            engaging, effective, and flexible learning experience that fits into your 
            busy life.
          </p>
        </div>
      </section>

      <section className="stats-section">
        <h2>Our Impact</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🎯</div>
            <h3>Excellence</h3>
            <p>We strive for the highest quality in everything we do, from course content to user experience.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Accessibility</h3>
            <p>Learning should be available to everyone, regardless of their circumstances or background.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🚀</div>
            <h3>Innovation</h3>
            <p>We continuously innovate to provide the best learning experience using the latest technology.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💡</div>
            <h3>Empowerment</h3>
            <p>We empower learners to take control of their education and achieve their goals.</p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-image">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="story-section">
        <h2>Our Story</h2>
        <div className="story-content">
          <p>
            EduElite was founded in 2020 with a simple yet powerful vision: to make 
            high-quality education accessible to learners around the world. What started 
            as a small team of educators and developers has grown into a thriving platform 
            that serves thousands of students globally.
          </p>
          <p>
            Our journey began when our founder, Itsuki, recognized the need for 
            flexible, affordable, and engaging online learning solutions. With backgrounds 
            in education, technology, and business, our team came together to create a 
            platform that truly puts learners first.
          </p>
          <p>
            Today, we continue to innovate and expand our offerings, always keeping our 
            core mission at the heart of everything we do: empowering individuals to 
            learn, grow, and achieve their dreams through education.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;