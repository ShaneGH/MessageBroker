
import entity = require("../../entity/queue");
import dto = require("../../web/dto/queue");
import SimpleQueueMapper = require("./simpleQueueMaper");
import ConsumerMapper = require("./consumerMapper");

/**Map from a queue entity to a simple queue dto*/
class QueueMapper extends SimpleQueueMapper {

  /**instance to be used instead of creating a new one*/
  public static instance = new QueueMapper();

  toDto(input: entity.IQueue) : dto.IQueue{

    // use super to map common properties
    var output = <dto.IQueue>super.toDto(input);
    if (output){
      // map more properties
      output.consumers = (input.consumers || []).map(c => ConsumerMapper.instance.toDto(c));
    }

    return output;
  }
}

export = QueueMapper;
