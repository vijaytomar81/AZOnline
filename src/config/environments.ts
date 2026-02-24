export type PcwKey = 'ctmMotorUrl' | 'ctmHomeUrl' | 'cnfUrl' | 'msmUrl' | 'gocoUrl';
export type EnvKey = 'azOnlineDev' | 'azOnlineTest' | 'azOnlineDemo' | 'azOnlineNft';

export type PcwUrls = Record<PcwKey, string>;

export type TargetEnvUrls = {
  customerPortalUrl: string;
  supportPortalUrl: string;
  aggTestToolUrl: string;
  backdatingToolUrl: string;
};

export type EnvironmentsConfig = {
  defaultEnv: EnvKey;
  pcw: PcwUrls;
  envs: Record<EnvKey, TargetEnvUrls>;
};

export const environments: EnvironmentsConfig = {
  defaultEnv: 'azOnlineTest',

  pcw: {
    ctmMotorUrl: "https://journey-gateway-product.uat.ctmers.io/car/5.0/start",
    ctmHomeUrl: "https://journey-gateway-product.uat.ctmers.io/home/4.0/start",
    cnfUrl: "https://my.confusedpartnertest.co.uk",
    msmUrl: "https://pre.moneysupermarket.dev",
    gocoUrl: "https://www.partnertest-gocompare.com"
  },

  envs: {
    azOnlineDev: {
      customerPortalUrl: 'REPLACE_ME',
      supportPortalUrl: 'REPLACE_ME',
      aggTestToolUrl: 'REPLACE_ME',
      backdatingToolUrl: 'REPLACE_ME'
    },
    azOnlineTest: {
      customerPortalUrl: "https://customer-portal-lv-test.athenapaas.com",
      supportPortalUrl: "https://support-portal-lv-demo.athenapaas.com",
      aggTestToolUrl: "https://aggregator-test-portal-lv-test.athenapaas.com",
      backdatingToolUrl: "https://backdating-tool-lv-test.athenapaas.com"
    },
    azOnlineDemo: {
      customerPortalUrl: 'REPLACE_ME',
      supportPortalUrl: 'REPLACE_ME',
      aggTestToolUrl: 'REPLACE_ME',
      backdatingToolUrl: 'REPLACE_ME'
    },
    azOnlineNft: {
      customerPortalUrl: 'REPLACE_ME',
      supportPortalUrl: 'REPLACE_ME',
      aggTestToolUrl: 'REPLACE_ME',
      backdatingToolUrl: 'REPLACE_ME'
    }
  }
};
