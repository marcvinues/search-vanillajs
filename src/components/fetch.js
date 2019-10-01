export class FetchData extends HTMLElement {
  constructor(props) {
    super(props)

    this.state = {
      data: '',
      repos: []
    }
  }

  connectedCallback() {
    this.renderForm()
    this.addEventListener()
    this.renderRepos()
  }

  addEventListener() {
    const onForm = document.getElementById('form')
    onForm.addEventListener('submit', event => {
      event.preventDefault()
      const query = document.getElementById('term').value
      this.getUsers(query)
    })
  }

  hasPublicRepos() {
    const { public_repos, login } = this.state.data

    if (public_repos > 0) {
      this.getPublicRepos(login)
    } else {
      const divError = document.getElementById('repos')
      divError.innerHTML = 'No public repos'
    }
  }

  async getPublicRepos(login) {
    const request = await fetch(`https://api.github.com/users/${login}/repos`)
      .then(res => res.json())
      .then(data => data)
    this.state.repos = request
    this.renderRepos()
  }

  async getUsers(e) {
    const request = await fetch(`https://api.github.com/users/${e}`)
      .then(res => res.json())
      .then(data => data)
      
      if(request.message){
        alert('user dosnt exist')
      }

      if(request){
        this.state.data = request
        this.hasPublicRepos()
      } 

  }

  renderRepos() {
    const { repos } = this.state
    const divRepos = document.getElementById('repos')
    divRepos.innerHTML = `
    <ul class="list-group">
      ${repos.map((repo) => `<li class="list-group-item">${repo.name}</li>`)}
    </ul>
    `
  }

  renderForm() {
    this.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-sm-8 offset-sm-3 text-center" style="margin-top: 2em">
          <form id="form">
            <div class="form-group">
              <input type="text" class="form-control" id="term" placeholder="search user" />
            </div>
            <span class="input-group-btn">
            <button type="submit" class="btn btn-primary">Submit</button>
            </span>
          </form>
          <div id="repos"></div>
        </div>
      </div>
    </div>
    `
  }
}
