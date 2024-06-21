import React, {useCallback, useMemo} from 'react';
import BlockingView from '@components/BlockingViews/BlockingView';
import * as Illustrations from '@components/Icon/Illustrations';
import RadioListItem from '@components/SelectionList/RadioListItem';
import type {SelectorType} from '@components/SelectionScreen';
import SelectionScreen from '@components/SelectionScreen';
import useLocalize from '@hooks/useLocalize';
import usePermissions from '@hooks/usePermissions';
import useThemeStyles from '@hooks/useThemeStyles';
import * as Connections from '@libs/actions/connections/NetSuiteCommands';
import Navigation from '@libs/Navigation/Navigation';
import {canUseTaxNetSuite, getNetSuiteTaxAccountOptions} from '@libs/PolicyUtils';
import type {WithPolicyConnectionsProps} from '@pages/workspace/withPolicyConnections';
import withPolicyConnections from '@pages/workspace/withPolicyConnections';
import variables from '@styles/variables';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

function NetSuiteTaxPostingAccountSelectPage({policy}: WithPolicyConnectionsProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const {canUseNetSuiteUSATax} = usePermissions();

    const policyID = policy?.id ?? '-1';

    const config = policy?.connections?.netsuite.options.config;
    const netsuiteTaxAccountOptions = useMemo<SelectorType[]>(() => getNetSuiteTaxAccountOptions(policy ?? undefined, config?.taxPostingAccount), [config?.taxPostingAccount, policy]);

    const initiallyFocusedOptionKey = useMemo(() => netsuiteTaxAccountOptions?.find((mode) => mode.isSelected)?.keyForList, [netsuiteTaxAccountOptions]);

    const {subsidiaryList} = policy?.connections?.netsuite?.options?.data ?? {};
    const selectedSubsidiary = useMemo(() => {
        const selectedSub = (subsidiaryList ?? []).find((subsidiary) => subsidiary.internalID === config?.subsidiaryID);
        return selectedSub;
    }, [subsidiaryList, config?.subsidiaryID]);

    const updateTaxAccount = useCallback(
        ({value}: SelectorType) => {
            if (config?.taxPostingAccount !== value) {
                Connections.updateNetSuiteTaxPostingAccount(policyID, policy?.connections?.netsuite.tokenSecret ?? '', value, config?.taxPostingAccount);
            }
            Navigation.goBack(ROUTES.POLICY_ACCOUNTING_NETSUITE_EXPORT.getRoute(policyID));
        },
        [policyID, policy?.connections?.netsuite.tokenSecret, config?.taxPostingAccount],
    );

    const listEmptyContent = useMemo(
        () => (
            <BlockingView
                icon={Illustrations.TeleScope}
                iconWidth={variables.emptyListIconWidth}
                iconHeight={variables.emptyListIconHeight}
                title={translate('workspace.netsuite.noAccountsFound')}
                subtitle={translate('workspace.netsuite.noAccountsFoundDescription')}
                containerStyle={styles.pb10}
            />
        ),
        [translate, styles.pb10],
    );

    return (
        <SelectionScreen
            policyID={policyID}
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
            displayName={NetSuiteTaxPostingAccountSelectPage.displayName}
            sections={netsuiteTaxAccountOptions.length ? [{data: netsuiteTaxAccountOptions}] : []}
            listItem={RadioListItem}
            onSelectRow={updateTaxAccount}
            initiallyFocusedOptionKey={initiallyFocusedOptionKey}
            onBackButtonPress={() => Navigation.goBack(ROUTES.POLICY_ACCOUNTING_NETSUITE_EXPORT.getRoute(policyID))}
            title="workspace.netsuite.journalEntriesTaxPostingAccount"
            listEmptyContent={listEmptyContent}
            connectionName={CONST.POLICY.CONNECTIONS.NAME.NETSUITE}
            shouldBeBlocked={!!config?.suiteTaxEnabled || !config?.syncOptions.syncTax || !canUseTaxNetSuite(canUseNetSuiteUSATax, selectedSubsidiary?.country)}
        />
    );
}

NetSuiteTaxPostingAccountSelectPage.displayName = 'NetSuiteTaxPostingAccountSelectPage';

export default withPolicyConnections(NetSuiteTaxPostingAccountSelectPage);
