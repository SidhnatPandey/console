import Skeleton from 'react-loading-skeleton';

interface LogsProps {
    loading: boolean,
    logs: string[]
}

const Logs: React.FC<LogsProps> = ({ loading, logs }) => {
    return (
        <div className="scroll-container2" style={{
            height: '400px',
            backgroundColor: 'black',
            color: 'white',
            width: '100%',
            overflow: 'auto',
            padding: '10px',
        }}>
            {!loading && logs.map((log, index) => {
                return <p style={{ color: 'white', margin: 0, fontFamily: "monospace", whiteSpace: "pre-wrap" }} key={index}>{log}</p>
            })}
            {loading && <Skeleton width={600} height={10} />}
            {loading && <Skeleton width={400} height={10} />}
            {loading && <Skeleton width={800} height={10} />}
            {loading && <Skeleton width={500} height={10} />}
            {loading && <Skeleton width={600} height={10} />}
            {loading && <Skeleton width={300} height={10} />}
            {loading && <Skeleton width={400} height={10} />}
            {loading && <Skeleton width={800} height={10} />}
            {loading && <Skeleton width={600} height={10} />}
            {loading && <Skeleton width={400} height={10} />}
            {loading && <Skeleton width={800} height={10} />}
            {loading && <Skeleton width={500} height={10} />}
            {loading && <Skeleton width={600} height={10} />}
            {loading && <Skeleton width={300} height={10} />}
            {loading && <Skeleton width={400} height={10} />}
            {loading && <Skeleton width={800} height={10} />}
        </div>
    )
}

export default Logs