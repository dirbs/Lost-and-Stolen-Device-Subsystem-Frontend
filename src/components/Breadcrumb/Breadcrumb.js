import React from 'react';
import {Route, Link, matchPath} from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';
import routes from '../../routes';
import { I18n } from 'react-i18next';

//const findRouteName = url => routes[url];
const findRouteName = (url) => {
  let found;
  for (let path of Object.entries(routes)) {
    found = matchPath(url, {path, exact: true});

    if (found) {
      return routes[found.path[0]];
    }
  }
  return null;
};

const getPaths = (pathname) => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr, index) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

const BreadcrumbsItem = ({match, ...rest}) => {
  const routeName = findRouteName(match.url);
  if (routeName) {
    return (
        <I18n ns="translations">
        {
          (t, { i18n }) => (
            match.isExact ?
            (
              <BreadcrumbItem active>{t(routeName)}</BreadcrumbItem>
            ) :
            (
              <BreadcrumbItem>
                <Link to={match.url || ''}>
                  {t(routeName)}
                </Link>
              </BreadcrumbItem>
            )
          )
        }
        </I18n>
    );
  }
  return null;
};

const Breadcrumbs = ({location : {pathname}, match, ...rest}) => {
  const paths = getPaths(pathname);
  const items = paths.map((path, i) => <Route key={i++} path={path} component={BreadcrumbsItem}/>);
  return (
    <Breadcrumb>
      {items}
    </Breadcrumb>
  );
};

export default props => (
  <div>
    <Route path="/:path" component={Breadcrumbs} {...props} />
  </div>
);
