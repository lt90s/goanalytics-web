const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  appId: state => state.config.appId,
  appName: state => state.config.name,
  channels: state => state.config.channels,
  platforms: state => state.config.platforms,
  versions: state => state.config.versions
}
export default getters
