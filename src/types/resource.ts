import Record from './record';

type Resource = {
  data: Record,
  included?: Array<Record>,
};

export default Resource;