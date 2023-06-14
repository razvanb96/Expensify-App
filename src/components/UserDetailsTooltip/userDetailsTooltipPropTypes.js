import PropTypes from 'prop-types';
import personalDetailsPropType from '../../pages/personalDetailsPropType';
import {withLocalizePropTypes} from '../withLocalize';

const propTypes = {
    /** User's Account ID */
    accountID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Fallback User Details object used if no accountID */
    fallbackUserDetails: PropTypes.shape({
        /** Avatar URL */
        avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        /** Display Name */
        displayName: PropTypes.string,
        /** Login */
        login: PropTypes.string,
    }),
    /** Component that displays the tooltip */
    children: PropTypes.node.isRequired,
    /** List of personalDetails (keyed by accountID)  */
    personalDetailsList: PropTypes.objectOf(personalDetailsPropType),

    /** List of personalDetails (keyed by login)  */
    personalDetails: PropTypes.objectOf(personalDetailsPropType),

    /** The email of the copilot who took this action on behalf of the user */
    delegate: PropTypes.string,

    /** Localization props */
    ...withLocalizePropTypes
};

const defaultProps = {
    accountID: '',
    fallbackUserDetails: {displayName: '', login: '', avatar: ''},
    personalDetailsList: {},
    personalDetails: {},
    delegate: '',
};

export {propTypes, defaultProps};
