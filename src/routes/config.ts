import { REGISTER, LOGIN, INDIVIDUAL, AGENCY, PUBLISHED, SUPERADMIN } from 'src/utils/constants';
import { useParams } from 'react-router-dom';

import { PATH_MAIN, PATH_AUTH, PATH_PRE_AUTH, PATH_MAIN_ADMIN,PATH_PLAN } from './paths';
import { useSelector } from 'src/redux/store';
import useAuth from '../hooks/useAuth';

export const LoginPath = (): string => {
  const auth = useSelector((state) => state.auth.value);
  const registrationType = useSelector((state) => state.userType.value);
  const eventSlugDetails = useSelector((state: any) => state.eventSlug.value);
  const { user } = useAuth();
  const PATH_AFTER_LOGIN = PATH_MAIN.dashboard;

  let { event } = useParams();


  switch (true) {
    case auth.guest: {
      if (user?.phone_number) {
        if (eventSlugDetails.eventStatus === PUBLISHED) {
          const PATH_AFTER_LOGIN = `${PATH_PRE_AUTH}/${event}/preview`
          return PATH_AFTER_LOGIN;
        } else {
          const PATH_AFTER_LOGIN = `${PATH_PRE_AUTH}/${event}/selfie-filtering`;

          return PATH_AFTER_LOGIN;
        }
      } else {
        const PATH_AFTER_LOGIN = `${PATH_PRE_AUTH}/${event}/onboarding`;

        return PATH_AFTER_LOGIN;
      }
    }
    case auth.client: {
      const PATH_AFTER_LOGIN = PATH_MAIN.clientOnboarding;
      return PATH_AFTER_LOGIN;
    }
    case auth.teamMember: {
      const PATH_AFTER_LOGIN = PATH_MAIN.teamOnboarding;
      return PATH_AFTER_LOGIN;
    }
  
    default:
      if (auth.type === REGISTER) {
        if (registrationType.type === AGENCY) {
          // const PATH_AFTER_LOGIN = PATH_AUTH.agencyBrand;
          const PATH_AFTER_LOGIN = PATH_MAIN.dashboard;
          return PATH_AFTER_LOGIN;
        } else if (registrationType.type === INDIVIDUAL) {
          // const PATH_AFTER_LOGIN = PATH_AUTH.individualBrand;
          const PATH_AFTER_LOGIN = PATH_MAIN.dashboard;
          return PATH_AFTER_LOGIN;
        }
      } else if (auth.type === LOGIN) {
        if (user) {
          if (user?.account_type === SUPERADMIN) {
            const PATH_AFTER_LOGIN = PATH_MAIN_ADMIN.dashboard;
            return PATH_AFTER_LOGIN;
          } else {
            if(user?.user_plan){
              if(user?.user_plan.expired){
                const PATH_AFTER_LOGIN = PATH_PLAN.root;
              return PATH_AFTER_LOGIN;
              }else{
                const PATH_AFTER_LOGIN = PATH_MAIN.dashboard;
                return PATH_AFTER_LOGIN;
              }
            }
          }
        }
      }
  }

  return PATH_AFTER_LOGIN;
};
