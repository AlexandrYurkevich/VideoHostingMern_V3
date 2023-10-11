import mongoose from 'mongoose'

const SearchHistorySchema = mongoose.Schema(
{
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  request: String,
},{ timestamps: true }
)
const SearchHistory = mongoose.model('SearchHistory', SearchHistorySchema);
export default SearchHistory
