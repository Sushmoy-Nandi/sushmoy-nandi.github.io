# Sushmoy Nandi — Personal Website

Live site: [sushmoy-nandi.github.io](https://sushmoy-nandi.github.io/)

A personal portfolio built with Jekyll and the [al-folio](https://github.com/alshedivat/al-folio) theme. The upstream theme remains credited under its MIT license.

## Content

- \_pages/about.md: introduction and profile photo.
- \_pages/publications.md: research summary and conference announcement.
- \_projects/: projects supported by public GitHub repositories.
- assets/json/resume.json: CV content shown on the website.
- \_data/cv.yml: corresponding RenderCV data for a future PDF.
- \_data/socials.yml and \_data/repositories.yml: personal profiles and repositories.
- assets/img/personal/: personal images.

## Evidence and remaining details

Updated on 20 November 2026 from the owner's [LinkedIn profile](https://www.linkedin.com/in/sushmoy-nandi-737b41307/), [GitHub profile](https://github.com/Sushmoy-Nandi), public repositories, and [merged LeetPush contribution](https://github.com/husamql3/leetpush/pull/137). LinkedIn's full signed-in profile could not be read.

The displayed CGPA is explicitly the fifth-semester figure from LinkedIn, not a claim about the current CGPA. The research poster title is used for the research project; it is not treated as the final title of the accepted paper.

Still needed from the owner:

- [ ] Public email, and optional phone or other contact links.
- [ ] Current semester/status, exact degree title, expected graduation, and updated CGPA if desired.
- [ ] Earlier school/college names, qualifications, and dates.
- [ ] Employment/internship roles, organizations, dates, and contributions.
- [ ] Final accepted-paper title, author order, DOI/preprint/PDF, and publication status.
- [ ] Scholar/ORCID/ResearchGate links, if applicable.
- [ ] Awards, competition results, leadership, volunteering, and language proficiency.
- [ ] Preferred profile photo if replacing the current GitHub photo; final bio and featured-project choices.
- [ ] Personal blog posts, teaching materials, and book lists to replace their demo entries.

Keep every original section and its demo content. Replace only fields backed by confirmed personal information; keep unknown fields as clearly labelled demo examples. Personal projects remain alongside the original project layouts in the Demo category. Do not remove, hide or disable a section because personal details are missing. PDF generation and citation updates remain manual until their personal inputs are supplied.

## Development

    docker compose up

Changes pushed to main build and publish through GitHub Actions. Regression checks run in the deployment workflow.
