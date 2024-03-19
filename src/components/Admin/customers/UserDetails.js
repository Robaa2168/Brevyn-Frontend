import { useParams } from 'react-router-dom';
import UserInfo from './UserInfo';
import UserAccounts from './UserAccounts';
import UserConversions from './UserConversions';
import UserDeposits from './UserDeposits';
import UserWithdrawals from './UserWithdrawals';
import UserTransactions from './UserTransactions';
import AssociatedAccounts from './AssociatedAccounts';


const UserDetails = () => {
    const { userId } = useParams();

    return (
        <div className='pb-20'>
            <UserInfo userId={userId} />
            <UserAccounts userId={userId} />
            <UserConversions userId={userId} />
            <UserDeposits userId={userId} />
            <UserWithdrawals userId={userId} />
            <UserTransactions userId={userId} />
            <AssociatedAccounts userId={userId} />
        </div>
    );
};

export default UserDetails;
