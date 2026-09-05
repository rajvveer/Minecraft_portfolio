import './Project.scss';
import Button from '../Button/Button';
import { portfolio } from '../../../portfolio.config';

export default function Project({ projectID }) {
  const project = portfolio.projects[projectID];
  if (!project) return <p className="section-paragraph">Project not found.</p>;
  return <div className="project-container">
    {project.image ? <div className="project-image-wrapper"><img src={project.image} alt={project.title} className="project-image" /></div> : <div className={`project-banner project-${projectID}`}><span className="grass-block" aria-hidden="true" /><p>{project.category}</p><h2>{project.title}</h2></div>}
    <h2 className="project-section-header">About the Project</h2>
    <p className="section-paragraph">{project.description}</p>
    {project.url && <Button type="link" href={project.url}>Explore project</Button>}
    {project.repository && <Button type="link" href={project.repository}>View source code</Button>}
    {!project.url && !project.repository && <p className="project-status">More details coming soon.</p>}
  </div>;
}
