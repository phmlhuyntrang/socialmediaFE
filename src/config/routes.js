const routes = {
    home: '/',
    create: '/create',
    profile: '/:username',
    pinCreatedOfUser: '/:username/_created',
    pinSavedOfUser: '/:username/_saved',
    board: '/:username/board/:boardname',
    infoProfile: '/:username/edit-profile',
    accountSetting: '/:username/account-setting',
    changePassword: '/:username/password',
    register: '/register',
    login: '/login',
    admin: '/admin/dashboard',
    userAdmin: '/admin/user',
    typeAdmin: '/admin/type-post',
    contentReportAdmin: '/admin/content-report',
    postAdmin: '/admin/post',
    commentAdmin: '/admin/comment',
    statistic: '/admin/statistic',
    functionAdmin: '/admin/function',
    permissionAdmin: '/admin/permission',
    infoProfileAdmin: '/admin/:username/edit-profile',
    accountSettingAdmin: '/admin/:username/account-setting',
    changePasswordAdmin: '/admin/:username/password',
    pin: '/pin/:pinid',
    search: '/search/:searchvalue'
};

export default routes;
