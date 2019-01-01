import {range, getUserGroups, isPage401} from './helpers';

describe('Utilities helpers', ()=> {
  test('range must be exclusive', ()=> {
    let start = 1;
    let limit = 3;
    let step = 1;
    expect(range(start, limit, step)).toEqual([1, 2]);
  })

  test('range can accept a single argument', ()=> {
    let start = 1;
    expect(range(start)).toEqual([0]);
  })

  test('getUserGroups helper gets groups from keycloak roles', () => {
    const kcResource = {
      realm_access: {
        roles: ['uma_authorization', 'lsds_authority']
      }
    }
    expect(getUserGroups(kcResource)).toEqual(['lsds_authority']);
  })

  test('isPage401 helper detect 401 page', () => {
    const groups = ['lsds_authority'];
    expect(isPage401(groups)).toEqual(false);
  })
});
