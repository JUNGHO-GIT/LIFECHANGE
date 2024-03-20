// Test.tsx

import React from "react";
import {Helmet} from "react-helmet";

// ------------------------------------------------------------------------------------------------>
export const Test = () => {

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div>
      <Helmet>
        <link rel="stylesheet" href="/css/fonts/boxicons.css" />
        <link rel="stylesheet" href="/css/core.css" />
        <link rel="stylesheet" href="/css/theme-default.css" />
        <link rel="stylesheet" href="/css/demo.css" />
        <link rel="stylesheet" href="/css/perfect-scrollbar.css" />
        <link rel="stylesheet" href="/css/apex-charts.css" />
        <script src="/js/helpers.js"></script>
        <script src="/js/config.js"></script>
        <script src="/js/menu.js"></script>
        {/* <script src="/js/main.js"></script>
        <script src="/js/jquery.js"></script>
        <script src="/js/popper.js"></script>
        <script src="/js/bootstrap.js"></script>
        <script src="/js/perfect-scrollbar.js"></script>
        <script src="/js/apexcharts.js"></script>
        <script src="/js/dashboards-analytics.js"></script> */}
      </Helmet>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">

          {/** aside *****************************************************************************/}
          <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <div className="app-brand demo">
              <a href="/" className="app-brand-link">
                <span className="app-brand-text demo menu-text fw-bolder ms-2">Sneat</span>
              </a>
              <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                <i className="bx bx-chevron-left bx-sm align-middle"></i>
              </a>
            </div>
            <div className="menu-inner-shadow"></div>
            <ul className="menu-inner py-1">
              <li className="menu-item active">
                <a href="/" className="menu-link">
                  <i className="menu-icon tf-icons bx bx-home-circle"></i>
                  <div data-i18n="Analytics">Dashboard</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="javascript:void(0);" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-layout"></i>
                  <div data-i18n="Layouts">Layouts</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="layouts-without-menu.html" className="menu-link">
                      <div data-i18n="Without menu">Without menu</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="layouts-without-navbar.html" className="menu-link">
                      <div data-i18n="Without navbar">Without navbar</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="layouts-container.html" className="menu-link">
                      <div data-i18n="Container">Container</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="layouts-fluid.html" className="menu-link">
                      <div data-i18n="Fluid">Fluid</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="layouts-blank.html" className="menu-link">
                      <div data-i18n="Blank">Blank</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Pages</span>
              </li>
              <li className="menu-item">
                <a href="javascript:void(0);" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-dock-top"></i>
                  <div data-i18n="Account Settings">Account Settings</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="pages-account-settings-account.html" className="menu-link">
                      <div data-i18n="Account">Account</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-account-settings-notifications.html" className="menu-link">
                      <div data-i18n="Notifications">Notifications</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-account-settings-connections.html" className="menu-link">
                      <div data-i18n="Connections">Connections</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="javascript:void(0);" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-lock-open-alt"></i>
                  <div data-i18n="Authentications">Authentications</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="auth-login-basic.html" className="menu-link" target="_blank">
                      <div data-i18n="Basic">Login</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="auth-register-basic.html" className="menu-link" target="_blank">
                      <div data-i18n="Basic">Register</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="auth-forgot-password-basic.html" className="menu-link" target="_blank">
                      <div data-i18n="Basic">Forgot Password</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="javascript:void(0);" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-cube-alt"></i>
                  <div data-i18n="Misc">Misc</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="pages-misc-error.html" className="menu-link">
                      <div data-i18n="Error">Error</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-misc-under-maintenance.html" className="menu-link">
                      <div data-i18n="Under Maintenance">Under Maintenance</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Components</span>
              </li>
              <li className="menu-item">
                <a href="cards-basic.html" className="menu-link">
                  <i className="menu-icon tf-icons bx bx-collection"></i>
                  <div data-i18n="Basic">Cards</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="javascript:void(0)" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-box"></i>
                  <div data-i18n="User interface">User interface</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="ui-accordion.html" className="menu-link">
                      <div data-i18n="Accordion">Accordion</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-alerts.html" className="menu-link">
                      <div data-i18n="Alerts">Alerts</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-badges.html" className="menu-link">
                      <div data-i18n="Badges">Badges</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-buttons.html" className="menu-link">
                      <div data-i18n="Buttons">Buttons</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-carousel.html" className="menu-link">
                      <div data-i18n="Carousel">Carousel</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-collapse.html" className="menu-link">
                      <div data-i18n="Collapse">Collapse</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-dropdowns.html" className="menu-link">
                      <div data-i18n="Dropdowns">Dropdowns</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-footer.html" className="menu-link">
                      <div data-i18n="Footer">Footer</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-list-groups.html" className="menu-link">
                      <div data-i18n="List Groups">List groups</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-modals.html" className="menu-link">
                      <div data-i18n="Modals">Modals</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-navbar.html" className="menu-link">
                      <div data-i18n="Navbar">Navbar</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-offcanvas.html" className="menu-link">
                      <div data-i18n="Offcanvas">Offcanvas</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-pagination-breadcrumbs.html" className="menu-link">
                      <div data-i18n="Pagination &amp; Breadcrumbs">Pagination &amp; Breadcrumbs</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-progress.html" className="menu-link">
                      <div data-i18n="Progress">Progress</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-spinners.html" className="menu-link">
                      <div data-i18n="Spinners">Spinners</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-tabs-pills.html" className="menu-link">
                      <div data-i18n="Tabs &amp; Pills">Tabs &amp; Pills</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-toasts.html" className="menu-link">
                      <div data-i18n="Toasts">Toasts</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-tooltips-popovers.html" className="menu-link">
                      <div data-i18n="Tooltips &amp; Popovers">Tooltips &amp; popovers</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="ui-typography.html" className="menu-link">
                      <div data-i18n="Typography">Typography</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="javascript:void(0)" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-copy"></i>
                  <div data-i18n="Extended UI">Extended UI</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="extended-ui-perfect-scrollbar.html" className="menu-link">
                      <div data-i18n="Perfect Scrollbar">Perfect scrollbar</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="extended-ui-text-divider.html" className="menu-link">
                      <div data-i18n="Text Divider">Text Divider</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="icons-boxicons.html" className="menu-link">
                  <i className="menu-icon tf-icons bx bx-crown"></i>
                  <div data-i18n="Boxicons">Boxicons</div>
                </a>
              </li>
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Forms &amp; Tables</span>
              </li>
              <li className="menu-item">
                <a href="javascript:void(0);" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-detail"></i>
                  <div data-i18n="Form Elements">Form Elements</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="forms-basic-inputs.html" className="menu-link">
                      <div data-i18n="Basic Inputs">Basic Inputs</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="forms-input-groups.html" className="menu-link">
                      <div data-i18n="Input groups">Input groups</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="javascript:void(0);" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-detail"></i>
                  <div data-i18n="Form Layouts">Form Layouts</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="form-layouts-vertical.html" className="menu-link">
                      <div data-i18n="Vertical Form">Vertical Form</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="form-layouts-horizontal.html" className="menu-link">
                      <div data-i18n="Horizontal Form">Horizontal Form</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="tables-basic.html" className="menu-link">
                  <i className="menu-icon tf-icons bx bx-table"></i>
                  <div data-i18n="Tables">Tables</div>
                </a>
              </li>
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Misc</span>
              </li>
              <li className="menu-item">
                <a href="http://sgithub.com/themeselection/sneat-html-admin-template-free/issues" target="_blank" className="menu-link">
                  <i className="menu-icon tf-icons bx bx-support"></i>
                  <div data-i18n="Support">Support</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="http://sthemeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/" target="_blank" className="menu-link">
                  <i className="menu-icon tf-icons bx bx-file"></i>
                  <div data-i18n="Documentation">Documentation</div>
                </a>
              </li>
            </ul>
          </aside>
          {/** /.aside **/}

          {/** main ******************************************************************************/}
          <div className="layout-page">

            {/** navbar **************************************************************************/}
            <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
              <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                <a className="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                  <i className="bx bx-menu bx-sm"></i>
                </a>
              </div>
              <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                <div className="navbar-nav align-items-center">
                  <div className="nav-item d-flex align-items-center">
                    <i className="bx bx-search fs-4 lh-0"></i>
                    <input type="text" className="form-control border-0 shadow-none" placeholder="Search..." aria-label="Search..." />
                  </div>
                </div>
                <ul className="navbar-nav flex-row align-items-center ms-auto">
                  <li className="nav-item lh-1 me-3">
                    <a className="github-button" href="http://sgithub.com/themeselection/sneat-html-admin-template-free" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star themeselection/sneat-html-admin-template-free on GitHub">Star</a>
                  </li>
                  <li className="nav-item navbar-dropdown dropdown-user dropdown">
                    <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                      <div className="avatar avatar-online">
                        <img src="/img/avatars/1.png" alt="" className="w-px-40 h-auto rounded-circle" />
                      </div>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <a className="dropdown-item" href="#">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar avatar-online">
                                <img src="/img/avatars/1.png" alt="" className="w-px-40 h-auto rounded-circle" />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <span className="fw-semibold d-block">John Doe</span>
                              <small className="text-muted">Admin</small>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <div className="dropdown-divider"></div>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bx bx-user me-2"></i>
                          <span className="align-middle">My Profile</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bx bx-cog me-2"></i>
                          <span className="align-middle">Settings</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <span className="d-flex align-items-center align-middle">
                            <i className="flex-shrink-0 bx bx-credit-card me-2"></i>
                            <span className="flex-grow-1 align-middle">Billing</span>
                            <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <div className="dropdown-divider"></div>
                      </li>
                      <li>
                        <a className="dropdown-item" href="auth-login-basic.html">
                          <i className="bx bx-power-off me-2"></i>
                          <span className="align-middle">Log Out</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </nav>
            {/** /.navbar **/}

            {/** content *************************************************************************/}
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row">
                  <div className="col-lg-8 mb-4 order-0">
                    <div className="card">
                      <div className="d-flex align-items-end row">
                        <div className="col-sm-7">
                          <div className="card-body">
                            <h5 className="card-title text-primary">Congratulations John! 🎉</h5>
                            <p className="mb-4">You have done <span className="fw-bold">72%</span> more sales today. Check your new badge in your profile.</p>
                            <a href="javascript:;" className="btn btn-sm btn-outline-primary">View Badges</a>
                          </div>
                        </div>
                        <div className="col-sm-5 text-center text-sm-left">
                          <div className="card-body pb-0 px-0 px-md-4">
                            <img src="/img/illustrations/man-with-laptop-light.png" height="140" alt="View Badge User" data-app-dark-img="illustrations/man-with-laptop-dark.png" data-app-light-img="illustrations/man-with-laptop-light.png" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 order-1">
                    <div className="row">
                      <div className="col-lg-6 col-md-12 col-6 mb-4">
                        <div className="card">
                          <div className="card-body">
                            <div className="card-title d-flex align-items-start justify-content-between">
                              <div className="avatar flex-shrink-0">
                                <img src="/img/icons/unicons/chart-success.png" alt="chart success" className="rounded" />
                              </div>
                              <div className="dropdown">
                                <button className="btn p-0" type="button" id="cardOpt3" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                                  <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                  <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                </div>
                              </div>
                            </div>
                            <span className="fw-semibold d-block mb-1">Profit</span>
                            <h3 className="card-title mb-2">$12,628</h3>
                            <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +72.80%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-12 col-6 mb-4">
                        <div className="card">
                          <div className="card-body">
                            <div className="card-title d-flex align-items-start justify-content-between">
                              <div className="avatar flex-shrink-0">
                                <img src="/img/icons/unicons/wallet-info.png" alt="Credit Card" className="rounded" />
                              </div>
                              <div className="dropdown">
                                <button className="btn p-0" type="button" id="cardOpt6" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt6">
                                  <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                  <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                </div>
                              </div>
                            </div>
                            <span>Sales</span>
                            <h3 className="card-title text-nowrap mb-1">$4,679</h3>
                            <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +28.42%</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
                    <div className="card">
                      <div className="row row-bordered g-0">
                        <div className="col-md-8">
                          <h5 className="card-header m-0 me-2 pb-3">Total Revenue</h5>
                          <div id="totalRevenueChart" className="px-2"></div>
                        </div>
                        <div className="col-md-4">
                          <div className="card-body">
                            <div className="text-center">
                              <div className="dropdown">
                                <button className="btn btn-sm btn-outline-primary dropdown-toggle" type="button" id="growthReportId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">2022</button>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="growthReportId">
                                  <a className="dropdown-item" href="javascript:void(0);">2021</a>
                                  <a className="dropdown-item" href="javascript:void(0);">2020</a>
                                  <a className="dropdown-item" href="javascript:void(0);">2019</a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div id="growthChart"></div>
                          <div className="text-center fw-semibold pt-3 mb-2">62% Company Growth</div>
                          <div className="d-flex px-xxl-4 px-lg-2 p-4 gap-xxl-3 gap-lg-1 gap-3 justify-content-between">
                            <div className="d-flex">
                              <div className="me-2">
                                <span className="badge bg-label-primary p-2"><i className="bx bx-dollar text-primary"></i></span>
                              </div>
                              <div className="d-flex flex-column">
                                <small>2022</small>
                                <h6 className="mb-0">$32.5k</h6>
                              </div>
                            </div>
                            <div className="d-flex">
                              <div className="me-2">
                                <span className="badge bg-label-info p-2"><i className="bx bx-wallet text-info"></i></span>
                              </div>
                              <div className="d-flex flex-column">
                                <small>2021</small>
                                <h6 className="mb-0">$41.2k</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
                    <div className="row">
                      <div className="col-6 mb-4">
                        <div className="card">
                          <div className="card-body">
                            <div className="card-title d-flex align-items-start justify-content-between">
                              <div className="avatar flex-shrink-0">
                                <img src="/img/icons/unicons/paypal.png" alt="Credit Card" className="rounded" />
                              </div>
                              <div className="dropdown">
                                <button className="btn p-0" type="button" id="cardOpt4" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt4">
                                  <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                  <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                </div>
                              </div>
                            </div>
                            <span className="d-block mb-1">Payments</span>
                            <h3 className="card-title text-nowrap mb-2">$2,456</h3>
                            <small className="text-danger fw-semibold"><i className="bx bx-down-arrow-alt"></i> -14.82%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 mb-4">
                        <div className="card">
                          <div className="card-body">
                            <div className="card-title d-flex align-items-start justify-content-between">
                              <div className="avatar flex-shrink-0">
                                <img src="/img/icons/unicons/cc-primary.png" alt="Credit Card" className="rounded" />
                              </div>
                              <div className="dropdown">
                                <button className="btn p-0" type="button" id="cardOpt1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu" aria-labelledby="cardOpt1">
                                  <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                  <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                </div>
                              </div>
                            </div>
                            <span className="fw-semibold d-block mb-1">Transactions</span>
                            <h3 className="card-title mb-2">$14,857</h3>
                            <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +28.14%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 mb-4">
                        <div className="card">
                          <div className="card-body">
                            <div className="d-flex justify-content-between flex-sm-row flex-column gap-3">
                              <div className="d-flex flex-sm-column flex-row align-items-start justify-content-between">
                                <div className="card-title">
                                  <h5 className="text-nowrap mb-2">Profile Report</h5>
                                  <span className="badge bg-label-warning rounded-pill">Year 2021</span>
                                </div>
                                <div className="mt-sm-auto">
                                  <small className="text-success text-nowrap fw-semibold"><i className="bx bx-chevron-up"></i> 68.2%</small>
                                  <h3 className="mb-0">$84,686k</h3>
                                </div>
                              </div>
                              <div id="profileReportChart"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">
                    <div className="card h-100">
                      <div className="card-header d-flex align-items-center justify-content-between pb-0">
                        <div className="card-title mb-0">
                          <h5 className="m-0 me-2">Order Statistics</h5>
                          <small className="text-muted">42.82k Total Sales</small>
                        </div>
                        <div className="dropdown">
                          <button className="btn p-0" type="button" id="orederStatistics" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="bx bx-dots-vertical-rounded"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end" aria-labelledby="orederStatistics">
                            <a className="dropdown-item" href="javascript:void(0);">Select All</a>
                            <a className="dropdown-item" href="javascript:void(0);">Refresh</a>
                            <a className="dropdown-item" href="javascript:void(0);">Share</a>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex flex-column align-items-center gap-1">
                            <h2 className="mb-2">8,258</h2>
                            <span>Total Orders</span>
                          </div>
                          <div id="orderStatisticsChart"></div>
                        </div>
                        <ul className="p-0 m-0">
                          <li className="d-flex mb-4 pb-1">
                            <div className="avatar flex-shrink-0 me-3">
                              <span className="avatar-initial rounded bg-label-primary"><i className="bx bx-mobile-alt"></i></span>
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <h6 className="mb-0">Electronic</h6>
                                <small className="text-muted">Mobile, Earbuds, TV</small>
                              </div>
                              <div className="user-progress">
                                <small className="fw-semibold">82.5k</small>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex mb-4 pb-1">
                            <div className="avatar flex-shrink-0 me-3">
                              <span className="avatar-initial rounded bg-label-success"><i className="bx bx-closet"></i></span>
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <h6 className="mb-0">Fashion</h6>
                                <small className="text-muted">T-shirt, Jeans, Shoes</small>
                              </div>
                              <div className="user-progress">
                                <small className="fw-semibold">23.8k</small>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex mb-4 pb-1">
                            <div className="avatar flex-shrink-0 me-3">
                              <span className="avatar-initial rounded bg-label-info"><i className="bx bx-home-alt"></i></span>
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <h6 className="mb-0">Decor</h6>
                                <small className="text-muted">Fine Art, Dining</small>
                              </div>
                              <div className="user-progress">
                                <small className="fw-semibold">849k</small>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex">
                            <div className="avatar flex-shrink-0 me-3">
                              <span className="avatar-initial rounded bg-label-secondary"><i className="bx bx-football"></i></span>
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <h6 className="mb-0">Sports</h6>
                                <small className="text-muted">Football, Cricket Kit</small>
                              </div>
                              <div className="user-progress">
                                <small className="fw-semibold">99</small>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 order-1 mb-4">
                    <div className="card h-100">
                      <div className="card-header">
                        <ul className="nav nav-pills" role="tablist">
                          <li className="nav-item">
                            <button type="button" className="nav-link active" role="tab" data-bs-toggle="tab" data-bs-target="#navs-tabs-line-card-income" aria-controls="navs-tabs-line-card-income" aria-selected="true">Income</button>
                          </li>
                          <li className="nav-item">
                            <button type="button" className="nav-link" role="tab">Expenses</button>
                          </li>
                          <li className="nav-item">
                            <button type="button" className="nav-link" role="tab">Profit</button>
                          </li>
                        </ul>
                      </div>
                      <div className="card-body px-0">
                        <div className="tab-content p-0">
                          <div className="tab-pane fade show active" id="navs-tabs-line-card-income" role="tabpanel">
                            <div className="d-flex p-4 pt-3">
                              <div className="avatar flex-shrink-0 me-3">
                                <img src="/img/icons/unicons/wallet.png" alt="User" />
                              </div>
                              <div>
                                <small className="text-muted d-block">Total Balance</small>
                                <div className="d-flex align-items-center">
                                  <h6 className="mb-0 me-1">$459.10</h6>
                                  <small className="text-success fw-semibold">
                                    <i className="bx bx-chevron-up"></i>
                                    42.9%
                                  </small>
                                </div>
                              </div>
                            </div>
                            <div id="incomeChart"></div>
                            <div className="d-flex justify-content-center pt-4 gap-2">
                              <div className="flex-shrink-0">
                                <div id="expensesOfWeek"></div>
                              </div>
                              <div>
                                <p className="mb-n1 mt-1">Expenses This Week</p>
                                <small className="text-muted">$39 less than last week</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 order-2 mb-4">
                    <div className="card h-100">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <h5 className="card-title m-0 me-2">Transactions</h5>
                        <div className="dropdown">
                          <button className="btn p-0" type="button" id="transactionID" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="bx bx-dots-vertical-rounded"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">
                            <a className="dropdown-item" href="javascript:void(0);">Last 28 Days</a>
                            <a className="dropdown-item" href="javascript:void(0);">Last Month</a>
                            <a className="dropdown-item" href="javascript:void(0);">Last Year</a>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <ul className="p-0 m-0">
                          <li className="d-flex mb-4 pb-1">
                            <div className="avatar flex-shrink-0 me-3">
                              <img src="/img/icons/unicons/paypal.png" alt="User" className="rounded" />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="text-muted d-block mb-1">Paypal</small>
                                <h6 className="mb-0">Send money</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-1">
                                <h6 className="mb-0">+82.6</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex mb-4 pb-1">
                            <div className="avatar flex-shrink-0 me-3">
                              <img src="/img/icons/unicons/wallet.png" alt="User" className="rounded" />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="text-muted d-block mb-1">Wallet</small>
                                <h6 className="mb-0">Mac'D</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-1">
                                <h6 className="mb-0">+270.69</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex mb-4 pb-1">
                            <div className="avatar flex-shrink-0 me-3">
                              <img src="/img/icons/unicons/chart.png" alt="User" className="rounded" />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="text-muted d-block mb-1">Transfer</small>
                                <h6 className="mb-0">Refund</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-1">
                                <h6 className="mb-0">+637.91</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex mb-4 pb-1">
                            <div className="avatar flex-shrink-0 me-3">
                              <img src="/img/icons/unicons/cc-success.png" alt="User" className="rounded" />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="text-muted d-block mb-1">Credit Card</small>
                                <h6 className="mb-0">Ordered Food</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-1">
                                <h6 className="mb-0">-838.71</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex mb-4 pb-1">
                            <div className="avatar flex-shrink-0 me-3">
                              <img src="/img/icons/unicons/wallet.png" alt="User" className="rounded" />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="text-muted d-block mb-1">Wallet</small>
                                <h6 className="mb-0">Starbucks</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-1">
                                <h6 className="mb-0">+203.33</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex">
                            <div className="avatar flex-shrink-0 me-3">
                              <img src="/img/icons/unicons/cc-warning.png" alt="User" className="rounded" />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="text-muted d-block mb-1">Mastercard</small>
                                <h6 className="mb-0">Ordered Food</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-1">
                                <h6 className="mb-0">-92.45</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-backdrop fade"></div>
            </div>
            {/** /.content **/}

          </div>
          {/** /.main **/}

        </div>
        <div className="layout-overlay layout-menu-toggle"></div>
      </div>
    </div>
  );
};
