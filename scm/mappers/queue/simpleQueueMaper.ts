
import entity = require("../../entity/queue");
import dto = require("../../web/dto/queue");

/**Map from a queue entity to a simple queue dto*/
class SimpleQueueMapper {
  public static instance = new SimpleQueueMapper();

  toDto(input: entity.IQueue) : dto.IQueue_Simple{
    if (!input) return null;

    return {
      id: input._id.toHexString(),
      name: input.name
    };
  }
}

export = SimpleQueueMapper;
