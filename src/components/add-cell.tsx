import './add-cell.css';
import { useActions } from '../hooks/use-actions';

interface AddCellProps {
	previousCellId: string | null;
	forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ forceVisible, previousCellId }) => {
	const { insertCell } = useActions();

	return (
		<div className={`add-cell ${forceVisible && 'force-visible'}`}>
			<div className="add-buttons">
				<button
					className="button is-rounded is-primary is-small"
					onClick={() => insertCell({ id: previousCellId, type: 'code' })}
				>
					<span className="icon is-small">
						<i className="fas fa-plus" />
					</span>
					<span>Code</span>
				</button>
				<button
					className="button is-rounded is-primary is-small"
					onClick={() => insertCell({ id: previousCellId, type: 'text' })}
				>
					<span className="icon is-small">
						<i className="fas fa-plus" />
					</span>
					<span>Text</span>
				</button>
			</div>
			<div className="divider"></div>
		</div>
	);
};

export default AddCell;
