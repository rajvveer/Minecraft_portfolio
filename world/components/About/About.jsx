import './About.scss';
import Button from '../Button/Button';
import { portfolio } from '../../../portfolio.config';

export default function About() {
  return <div className="data-container">
    {portfolio.portrait ? <div className="image-wrapper"><img src={portfolio.portrait} alt={portfolio.name} className="data-image" /></div> : <div className="profile-banner"><span className="grass-block" aria-hidden="true" /><h2>{portfolio.name}</h2><p>{portfolio.role}</p></div>}
    <h2 className="about-section-header">About Me</h2>
    <p className="section-paragraph">{portfolio.introduction}</p>
    {portfolio.about.map(text => <p key={text} className="section-paragraph">{text}</p>)}
    <h2 className="about-section-header">Things I Build With</h2>
    <div className="skill-list">{portfolio.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
    <h2 className="about-section-header">Let's Connect</h2>
    {portfolio.email && <Button type="link" href={`mailto:${portfolio.email}`}>Send me an email</Button>}
    {Object.entries(portfolio.socials).filter(([, url]) => url).map(([name, url]) => <Button key={name} type="link" href={url}>{name}</Button>)}
    {!portfolio.email && !Object.values(portfolio.socials).some(Boolean) && <p className="section-paragraph">Contact details coming soon.</p>}
  </div>;
}
